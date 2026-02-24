namespace CharacterMapRPG.BattleCore
{
    public static class EnemyAiPolicy
    {
        public static ActionType Choose(FighterStats enemy, FighterStats player)
        {
            if (enemy.CurrentHp <= 0 || player.CurrentHp <= 0)
            {
                return ActionType.Attack;
            }

            bool canFinish = EstimateDamage(enemy) >= player.CurrentHp;
            if (canFinish)
            {
                return ActionType.Attack;
            }

            float hpRatio = (float)enemy.CurrentHp / enemy.MaxHp;
            if (hpRatio < 0.35f)
            {
                return ActionType.Heal;
            }

            return ActionType.Attack;
        }

        private static int EstimateDamage(FighterStats attacker)
        {
            return attacker.Atk;
        }
    }
}
