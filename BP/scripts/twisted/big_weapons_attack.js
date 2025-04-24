import { world } from '@minecraft/server';
import { giantMonsters } from './main.js';
import { getPlayerSlotItem, shootEntityFromPlayer } from './utils/utils.js';

export function flamingAttack(hitEntity, itemStack) {
    if (hitEntity.typeId != 'twisted:mobjira') {
        if (itemStack.typeId === 'twisted:stelix_bertha') {
            hitEntity.setOnFire(30, false);
        } else {
            hitEntity.setOnFire(10, false);
        }
    }
}

export function knockbackAttack(attackingEntity, itemStack, hitEntity) {
    const dir = attackingEntity.getViewDirection();
    const weapon = itemStack;
    let monsterDefense = giantMonsters.includes(hitEntity.typeId) ? 8 : 0;

    if (weapon.typeId === 'twisted:stelix_bertha') {
        hitEntity.applyKnockback(dir.x, dir.z, 30 - monsterDefense, 1);
    } else if (weapon.typeId === 'twisted:battle_axe') {
        hitEntity.applyKnockback(dir.x, dir.z, 4 - monsterDefense, 1);
    } else {
        hitEntity.applyKnockback(dir.x, dir.z, 10 - monsterDefense, 1);
    }
}

export function longRangeAttack(player) {
    const tags = {
        royal: 'royal_guardian_attacking',
        big: 'big_bertha_attacking',
        stelix: 'stelix_bertha_attacking',
        b_axe: 'battle_axe_attacking',
        queen_b_axe: 'queen_battle_axe_attacking',
    }
    //ROYAL GUARDIAN
    if (player.getTags().includes(tags.royal)) {
        shootEntityFromPlayer('twisted:rgp', player);
        player.removeTag(tags.royal);
        //BIG BERTHA
    } else if (player.getTags().includes(tags.big)) {
        shootEntityFromPlayer('twisted:bbp', player);
        player.removeTag(tags.big);
        //STELIX BERTHA
    } else if (player.getTags().includes(tags.stelix)) {
        shootEntityFromPlayer('twisted:sbp', player);
        player.removeTag(tags.stelix);
        //BATTLE AXE
    } else if (player.getTags().includes(tags.b_axe)) {
        shootEntityFromPlayer('twisted:bap', player);
        player.removeTag(tags.b_axe);
        //QUEEN BATTLE AXE
    } else if (player.getTags().includes(tags.queen_b_axe)) {
        shootEntityFromPlayer('twisted:qba', player);
        player.removeTag(tags.queen_b_axe);
    }
}

world.afterEvents.projectileHitEntity.subscribe(e => {
    const bigWeaponsProjectiles = [
        'twisted:bbp', 'twisted:sbp', 'twisted:rgp', 'twisted:bap', 'twisted:qba'
    ];

    if (bigWeaponsProjectiles.includes(e.projectile.typeId)) {
        const hitEntity = e.getEntityHit().entity;
        const tags = e.projectile.getTags();
        const playerTag = tags.find(tag => tag.startsWith('player:'));

        if (!playerTag) return;

        const ownerName = playerTag.split(':')[1];
        const ownerPlayer = world.getPlayers().find(p => p.name === ownerName);

        if (!ownerPlayer) return;

        const mainhandItem = getPlayerSlotItem(ownerPlayer);
        const weaponsFlameFilter = [
            'twisted:battle_axe',
            'twisted:royal_guardian'
        ]

        if (!(weaponsFlameFilter.includes(mainhandItem?.typeId))) {
            flamingAttack(hitEntity, mainhandItem);
        }

        knockbackAttack(ownerPlayer, mainhandItem, hitEntity);
    }
})
