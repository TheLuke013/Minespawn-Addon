import { world, system } from '@minecraft/server';
import * as Vector3 from './utils/vector3.js';
import { getPlayerMainhandItem, shootEntityFromPlayer } from './utils/utils.js';
import { bigWeapons } from './main.js';

world.afterEvents.entityHitEntity.subscribe(e => {
    if (e.damagingEntity.typeId === 'minecraft:player' && e.hitEntity.typeId === 'minespawn:mobjira') {
        const player = e.damagingEntity;
        const mobjira = e.hitEntity;
        const mainhandItem = getPlayerMainhandItem(player);

        if (bigWeapons.includes(mainhandItem?.typeId)) {
            mobjira.runCommand('event entity @s minespawn:add_kbr');
        }
    }
})

export function mobjiraBehaviours(mobjira, player) {
    //impulse on jumping
    if (mobjira.getTags().includes('mobjira_is_jumping')) {
        const direction = Vector3.fromRotation(mobjira.getRotation()).multiply(5);
        mobjira.applyImpulse({ x: direction.x, y: direction.y, z: direction.z });
        mobjira.removeTag('mobjira_is_jumping');
    } else if (mobjira.getTags().includes('ready_for_breath')) {
        world.playSound('mob.mobjira.atomic_breath', player.location, {
            volume: 1000
        });
        mobjira.removeTag('ready_for_breath');
    }

    //regeneration
    const healthComponent = mobjira.getComponent('minecraft:health');
    if (healthComponent && healthComponent?.currentValue > 4000) {
        mobjira.addEffect('minecraft:regeneration', 100, { amplifier: 255, showParticles: false });
    }

    //knockback resistance
    const knockbackComponent = mobjira.getComponent('minecraft:knockback_resistance');
    if (knockbackComponent) {
        world.sendMessage('tem component knockback');
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