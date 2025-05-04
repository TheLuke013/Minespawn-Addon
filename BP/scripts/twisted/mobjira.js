import { world } from '@minecraft/server';
import * as Vector3 from './utils/vector3.js';
import { getPlayerSlotItem, getDistance } from './utils/utils.js';
import { bigWeapons } from './main.js';

const kDist = 12;

world.afterEvents.entityHitEntity.subscribe(e => {
    //player source damage
    if (e.damagingEntity.typeId === 'minecraft:player' && e.hitEntity.typeId === 'twisted:mobjira') {
        const player = e.damagingEntity;
        const mobjira = e.hitEntity;
        const mainhandItem = getPlayerSlotItem(player);

        if (bigWeapons.includes(mainhandItem?.typeId)) {
            mobjira.runCommand('event entity @s twisted:add_kbr');
        }
    }

    //mobjira source damage
    if (e.damagingEntity.typeId === 'twisted:mobjira') {
        const dir = e.damagingEntity.getViewDirection();
        e.hitEntity.applyKnockback(dir.x, dir.z, kDist, 1);
    }
})

export function mobjiraBehaviours(mobjira, player) {
    //impulse on jumping
    if (mobjira.getTags().includes('mobjira_is_jumping')) {
        const direction = Vector3.fromRotation(mobjira.getRotation()).multiply(5);
        mobjira.applyImpulse({ x: direction.x, y: direction.y, z: direction.z });
        mobjira.removeTag('mobjira_is_jumping');
    }

    //long distance knockback
    const distance = getDistance(mobjira, player);
    if (distance <= 10 && !(player.matches({ gameMode: "creative" }))) {
        const dir = mobjira.getViewDirection();
        player.applyKnockback(dir.x, dir.z, kDist, 1);
    }

    //mobjira jumping knockback
    if (player.getTags().includes('mobjira_jump_knockback')) {
        const kNormalPower = 10;
        const kProtecPower = 1;

        if (player.getTags().includes('knockback_resistance')) {
            player.applyKnockback(kProtecPower, kProtecPower, kProtecPower, 1);
        } else {
            player.applyKnockback(kNormalPower, kNormalPower, kNormalPower, 1);
        }
        player.removeTag('mobjira_jump_knockback');
    }
}