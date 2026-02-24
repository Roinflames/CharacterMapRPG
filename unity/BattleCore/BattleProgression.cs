namespace CharacterMapRPG.BattleCore
{
    public sealed class BattleProgression
    {
        public int Level { get; private set; } = 1;
        public int Exp { get; private set; }
        public int NextExp { get; private set; } = 20;

        public bool Level3BossRequired { get; private set; } = true;
        public bool Level3BossActive { get; private set; }
        public bool Level3BossDefeated { get; private set; }
        public string Level3BossEncounterId { get; private set; } = "lvl3_boss_portal";

        public void ConfigureLevel3Boss(string encounterId, bool required)
        {
            Level3BossEncounterId = string.IsNullOrWhiteSpace(encounterId) ? "lvl3_boss_portal" : encounterId;
            Level3BossRequired = required;
        }

        public bool GainExp(int amount)
        {
            if (amount <= 0) return false;

            Exp += amount;
            bool leveledUp = false;
            while (Exp >= NextExp)
            {
                Exp -= NextExp;
                Level += 1;
                NextExp = (int)(NextExp * 1.35f);
                leveledUp = true;
            }

            if (Level >= 3 && Level3BossRequired && !Level3BossDefeated)
            {
                Level3BossActive = true;
            }

            return leveledUp;
        }

        public bool IsBossEncounter(string encounterId)
        {
            return encounterId == Level3BossEncounterId;
        }

        public bool CanEscapeEncounter(string encounterId, bool isBoss)
        {
            if (isBoss) return false;
            if (Level3BossActive && encounterId == Level3BossEncounterId) return false;
            return true;
        }

        public bool CanAdvanceRoute()
        {
            if (!Level3BossRequired) return true;
            if (Level < 3) return true;
            return Level3BossDefeated;
        }

        public void MarkBossVictory(string encounterId)
        {
            if (!IsBossEncounter(encounterId)) return;
            Level3BossDefeated = true;
            Level3BossActive = false;
        }
    }
}
