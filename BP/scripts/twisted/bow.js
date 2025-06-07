import { system, world, EntityEquippableComponent, EquipmentSlot } from "@minecraft/server";
import { shootEntityFromPlayer } from './utils/utils.js';
import { useAmmunition, hasAmmunition } from './shooter.js';
import { itemDurability } from './item_durability.js';

const tags = ["ultimate"]

world.afterEvents.projectileHitEntity.subscribe(e => {
    //TODO - FIX THIS CODE
    try {
        if (e.projectile.typeId === 'twisted:ultimate_arrow') {
            const hitEntity = e.getEntityHit().entity;
            const tags = e.projectile.getTags();
            world.sendMessage(`${tags.length}`);
            const playerTag = tags.find(tag => tag.startsWith('player:'));

            if (!playerTag) return;

            const ownerName = playerTag.split(':')[1];
            const ownerPlayer = world.getPlayers().find(p => p.name === ownerName);

            if (!ownerPlayer) return;

            const dir = ownerPlayer.getViewDirection();

            hitEntity.applyKnockback(dir.x, dir.z, 30, 1);
        }
    } catch (e) {
        //world.sendMessage(`${e}`);
    }
});

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
            shootEntityFromPlayer('twisted:ultimate_arrow', player);
            player.playSound('random.bow', player.location);
            itemDurability(player);
            if (!player.getTags().includes('enchanted:infinity')) {
                useAmmunition(player, 'twisted:ultimate_arrow');
            }
            delay = 0;
        }
    }, 1);
}

world.afterEvents.entityDie.subscribe(e => {
    if (e.deadEntity.typeId === 'minecraft:player' && e.deadEntity.getTags().includes('using')) {
        e.deadEntity.removeTag('using');
    }
})

world.afterEvents.itemUse.subscribe((use) => {
    try {
        const p = use.source;
        const bow = "_bow";
        const item = use.itemStack.typeId;
        if (item.toLowerCase().includes(bow) && hasAmmunition(p, 'twisted:ultimate_arrow', true)) {
            p.addTag("using");
            startAutoBowLoop(p);
        }
    } catch (e) {

    }
});

world.afterEvents.itemStopUse.subscribe((stop) => {
    try {
        const p = stop.source;
        p.removeTag("using");
    } catch (e) {

    }
})