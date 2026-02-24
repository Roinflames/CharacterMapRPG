using System;
using System.Collections.Generic;

namespace CharacterMapRPG.BattleCore
{
    public enum BattlePhase
    {
        StartTurn,
        SelectAction,
        ResolveAction,
        EndTurn,
        Result
    }

    public enum ActionType
    {
        Attack,
        Heal,
        Escape
    }

    public enum TeamSide
    {
        Player,
        Enemy
    }

    [Serializable]
    public sealed class FighterStats
    {
        public string Id = "fighter";
        public int MaxHp = 30;
        public int CurrentHp = 30;
        public int Atk = 6;
        public int Def = 3;
        public int CritThreshold = 20;
        public int HealPower = 7;
        public float EscapeChance = 0.6f;
    }

    [Serializable]
    public sealed class EncounterDefinition
    {
        public string Id = "encounter_1";
        public string DisplayName = "Enemigo";
        public bool IsBoss;
        public bool EscapeAllowed = true;
        public int ExpReward = 24;
        public FighterStats EnemyStats = new FighterStats
        {
            Id = "enemy",
            MaxHp = 30,
            CurrentHp = 30,
            Atk = 7,
            Def = 3,
            CritThreshold = 20,
            HealPower = 5,
            EscapeChance = 0f
        };
    }

    public static class EncounterCatalog
    {
        public static List<EncounterDefinition> CreateDefaults()
        {
            return new List<EncounterDefinition>
            {
                new EncounterDefinition
                {
                    Id = "r1m1",
                    DisplayName = "Lobo Sombrio",
                    IsBoss = false,
                    EscapeAllowed = true,
                    ExpReward = 18,
                    EnemyStats = new FighterStats
                    {
                        Id = "lobo_sombrio",
                        MaxHp = 26,
                        CurrentHp = 26,
                        Atk = 8,
                        Def = 3,
                        CritThreshold = 19,
                        HealPower = 4,
                        EscapeChance = 0f
                    }
                },
                new EncounterDefinition
                {
                    Id = "r1m2",
                    DisplayName = "Bandido del Valle",
                    IsBoss = false,
                    EscapeAllowed = true,
                    ExpReward = 20,
                    EnemyStats = new FighterStats
                    {
                        Id = "bandido_valle",
                        MaxHp = 24,
                        CurrentHp = 24,
                        Atk = 7,
                        Def = 2,
                        CritThreshold = 20,
                        HealPower = 3,
                        EscapeChance = 0f
                    }
                },
                new EncounterDefinition
                {
                    Id = "r1m3",
                    DisplayName = "Guardian de Piedra",
                    IsBoss = false,
                    EscapeAllowed = true,
                    ExpReward = 24,
                    EnemyStats = new FighterStats
                    {
                        Id = "guardian_piedra",
                        MaxHp = 32,
                        CurrentHp = 32,
                        Atk = 10,
                        Def = 5,
                        CritThreshold = 19,
                        HealPower = 5,
                        EscapeChance = 0f
                    }
                },
                new EncounterDefinition
                {
                    Id = "r1m4",
                    DisplayName = "Capitan del Portal",
                    IsBoss = false,
                    EscapeAllowed = true,
                    ExpReward = 30,
                    EnemyStats = new FighterStats
                    {
                        Id = "capitan_portal",
                        MaxHp = 36,
                        CurrentHp = 36,
                        Atk = 10,
                        Def = 6,
                        CritThreshold = 19,
                        HealPower = 6,
                        EscapeChance = 0f
                    }
                },
                new EncounterDefinition
                {
                    Id = "r2m1",
                    DisplayName = "Bruja del Pantano",
                    IsBoss = false,
                    EscapeAllowed = true,
                    ExpReward = 22,
                    EnemyStats = new FighterStats
                    {
                        Id = "bruja_pantano",
                        MaxHp = 29,
                        CurrentHp = 29,
                        Atk = 9,
                        Def = 4,
                        CritThreshold = 19,
                        HealPower = 7,
                        EscapeChance = 0f
                    }
                },
                new EncounterDefinition
                {
                    Id = "r2m2",
                    DisplayName = "Caballero Perdido",
                    IsBoss = false,
                    EscapeAllowed = true,
                    ExpReward = 24,
                    EnemyStats = new FighterStats
                    {
                        Id = "caballero_perdido",
                        MaxHp = 33,
                        CurrentHp = 33,
                        Atk = 10,
                        Def = 5,
                        CritThreshold = 19,
                        HealPower = 4,
                        EscapeChance = 0f
                    }
                },
                new EncounterDefinition
                {
                    Id = "r2m3",
                    DisplayName = "Bestia de Ceniza",
                    IsBoss = false,
                    EscapeAllowed = true,
                    ExpReward = 28,
                    EnemyStats = new FighterStats
                    {
                        Id = "bestia_ceniza",
                        MaxHp = 34,
                        CurrentHp = 34,
                        Atk = 10,
                        Def = 5,
                        CritThreshold = 19,
                        HealPower = 5,
                        EscapeChance = 0f
                    }
                },
                new EncounterDefinition
                {
                    Id = "r2m4",
                    DisplayName = "Arquero del Eclipse",
                    IsBoss = false,
                    EscapeAllowed = true,
                    ExpReward = 30,
                    EnemyStats = new FighterStats
                    {
                        Id = "arquero_eclipse",
                        MaxHp = 34,
                        CurrentHp = 34,
                        Atk = 11,
                        Def = 4,
                        CritThreshold = 18,
                        HealPower = 5,
                        EscapeChance = 0f
                    }
                },
                new EncounterDefinition
                {
                    Id = "r2m5",
                    DisplayName = "Dragon Menor",
                    IsBoss = false,
                    EscapeAllowed = true,
                    ExpReward = 36,
                    EnemyStats = new FighterStats
                    {
                        Id = "dragon_menor",
                        MaxHp = 40,
                        CurrentHp = 40,
                        Atk = 12,
                        Def = 6,
                        CritThreshold = 18,
                        HealPower = 6,
                        EscapeChance = 0f
                    }
                },
                new EncounterDefinition
                {
                    Id = "lvl3_boss_portal",
                    DisplayName = "Senor del Portal",
                    IsBoss = true,
                    EscapeAllowed = false,
                    ExpReward = 80,
                    EnemyStats = new FighterStats
                    {
                        Id = "senor_portal",
                        MaxHp = 42,
                        CurrentHp = 42,
                        Atk = 11,
                        Def = 7,
                        CritThreshold = 19,
                        HealPower = 6,
                        EscapeChance = 0f
                    }
                }
            };
        }
    }

    public sealed class ActionResolution
    {
        public ActionType Type;
        public TeamSide Actor;
        public TeamSide Target;
        public int D20Roll;
        public int PredictedDamage;
        public int AppliedDamage;
        public int HealAmount;
        public bool IsCritical;
        public bool Escaped;
        public bool IsKo;
        public string LogLine = "";
    }

    public sealed class BattleSnapshot
    {
        public BattlePhase Phase;
        public TeamSide CurrentTurn;
        public int PlayerHp;
        public int EnemyHp;
        public bool IsFinished;
        public TeamSide? Winner;
        public ActionResolution LastResolution;
    }
}
