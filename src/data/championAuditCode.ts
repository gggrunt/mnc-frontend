export enum ChampionAuditCode {
    NoMagicDamage = 'No Magic Damage',
    NoPhysicalDamage = 'No Physical Damage',
    LowDamage = 'Low Damage',
}

export function getChampionAuditCodeColor(code: ChampionAuditCode): string {
    switch (code) {
        case ChampionAuditCode.NoPhysicalDamage:
            return 'orange';
        case ChampionAuditCode.NoMagicDamage:
            return 'violet';
        case ChampionAuditCode.LowDamage:
            return 'grey';
        default:
            return 'white';
    }
}
