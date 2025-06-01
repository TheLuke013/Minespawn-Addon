import { system, world, EntityEquippableComponent, EquipmentSlot } from "@minecraft/server";
import { shootEntityFromPlayer } from './utils/utils.js';
import { useAmmunition, hasAmmunition } from './shooter.js';

const tags = ["ultimate"]

export function bowFunction(player) {
    bowUsing(player);
    detectEnchantements(player);
    player.runCommandAsync("function arrow");
}

function bowUsing(player) {
    const equip = player.getComponent(EntityEquippableComponent.componentId);
    const hand = equip.getEquipment(EquipmentSlot.Mainhand);
    for (const bows of tags) {
        if (player.hasTag("using")) {
            if (hand.typeId == `twisted:${bows}_bow`) {
                player.runCommandAsync(`playanimation @s[hasitem={item=twisted:${bows}_arrow}] animation.weapons.bow_and_arrow root 0.001 "!query.is_using_item"`)
            }
        }
    }
}

function detectEnchantements(p) {
    const equip = p.getComponent(EntityEquippableComponent.componentId);
    const hand = equip.getEquipment(EquipmentSlot.Mainhand);
    if (hand) {
        const enchantable = hand.getComponent("enchantable");
        for (const bows of tags) {
            if (hand.typeId.includes(`${bows}_bow`)) {
                if (enchantable) {
                    if (enchantable.getEnchantment("infinity")) {
                        p.addTag(`enchanted:infinity`)
                    }
                    if (!enchantable.getEnchantment("infinity")) {
                        p.removeTag(`enchanted:infinity`)
                    }
                    if (enchantable.getEnchantments().length === 0) {
                        p.getTags().forEach(tags => {
                            if (tags.includes("enchanted:")) {
                                p.removeTag(tags)
                            }
                        });
                    }
                }
            }
        }
        if (!hand.typeId.includes(`_bow`)) {
            p.getTags().forEach(tag => {
                if (tag.includes("enchanted:")) {
                    p.removeTag(tag)
                }
            });
        }
    }
    if (!hand) {
        p.getTags().forEach(tag => {
            if (tag.includes("enchanted:")) {
                p.removeTag(tag)
            }
        });
    }
}

function startAutoBowLoop(player) {
    let delay = 0;
    const interval = system.runInterval(() => {
        if (!player.hasTag("using")) {
            system.clearRun(interval);
            return;
        }

        delay++;
        if (delay >= 5) {
            if (hasAmmunition(player, 'twisted:ultimate_arrow')) {
                shootEntityFromPlayer('twisted:ultimate_arrow', player);
                player.playSound('random.bow', player.location);
                if (!player.getTags().includes('enchanted:infinity')) {
                    useAmmunition(player, 'twisted:ultimate_arrow');
                }
            }
            delay = 0;
        }
    }, 1);
}

world.afterEvents.itemUse.subscribe((use) => {
    try {
        const p = use.source;
        const bow = "_bow";
        const item = use.itemStack.typeId;
        if (item.toLowerCase().includes(bow)) {
            p.addTag("using");
            startAutoBowLoop(p);
        }
    } catch (e) {

    }
});

world.afterEvents.itemStopUse.subscribe((stop) => {
    try {
        const p = stop.source;
        const item = stop.itemStack;
        p.removeTag("using");
        for (const bows of tags) {
            if (p.hasTag(`${bows}`)) {
                if (item.typeId == `twisted:${bows}_bow` && p.hasTag("using")) {
                    Durability(item, p);
                }
            }
        }
    } catch (e) {

    }
})