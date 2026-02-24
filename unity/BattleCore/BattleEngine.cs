using System;

namespace CharacterMapRPG.BattleCore
{
    public sealed class BattleEngine
    {
        private readonly Random _rng;
        private FighterStats _player;
        private FighterStats _enemy;

        public BattlePhase Phase { get; private set; } = BattlePhase.StartTurn;
        public TeamSide CurrentTurn { get; private set; } = TeamSide.Player;
        public bool IsFinished { get; private set; }
        public TeamSide? Winner { get; private set; }
        public ActionResolution LastResolution { get; private set; }

        public BattleEngine(int? seed = null)
        {
            _rng = seed.HasValue ? new Random(seed.Value) : new Random();
        }

        public void Initialize(FighterStats player, FighterStats enemy)
        {
            _player = Clone(player);
            _enemy = Clone(enemy);
            Phase = BattlePhase.StartTurn;
            CurrentTurn = TeamSide.Player;
            IsFinished = false;
            Winner = null;
            LastResolution = null;
        }

        public BattleSnapshot Snapshot()
        {
            return new BattleSnapshot
            {
                Phase = Phase,
                CurrentTurn = CurrentTurn,
                PlayerHp = _player.CurrentHp,
                EnemyHp = _enemy.CurrentHp,
                IsFinished = IsFinished,
                Winner = Winner,
                LastResolution = LastResolution
            };
        }

        public ActionResolution PreviewPlayerAttack()
        {
            EnsureReadyForPlayerInput();
            int d20 = RollD20();
            bool crit = d20 >= _player.CritThreshold;
            int baseDamage = Math.Max(1, _player.Atk - _enemy.Def);
            int predicted = crit ? baseDamage * 2 : baseDamage;
            return new ActionResolution
            {
                Actor = TeamSide.Player,
                Target = TeamSide.Enemy,
                Type = ActionType.Attack,
                D20Roll = d20,
                PredictedDamage = predicted,
                IsCritical = crit,
                LogLine = crit ? $"Critico previsto: {predicted}" : $"Dano previsto: {predicted}"
            };
        }

        public ActionResolution ExecutePlayerAction(ActionType action)
        {
            EnsureReadyForPlayerInput();
            Phase = BattlePhase.ResolveAction;
            ActionResolution resolution = ResolveAction(TeamSide.Player, action);
            PostResolve(resolution);
            return resolution;
        }

        public ActionResolution ExecuteEnemyTurn()
        {
            if (IsFinished) throw new InvalidOperationException("Battle finished.");
            if (CurrentTurn != TeamSide.Enemy) throw new InvalidOperationException("Not enemy turn.");
            if (Phase != BattlePhase.SelectAction && Phase != BattlePhase.StartTurn)
            {
                throw new InvalidOperationException($"Invalid phase: {Phase}");
            }

            Phase = BattlePhase.ResolveAction;
            ActionType aiAction = EnemyAiPolicy.Choose(_enemy, _player);
            ActionResolution resolution = ResolveAction(TeamSide.Enemy, aiAction);
            PostResolve(resolution);
            return resolution;
        }

        private void EnsureReadyForPlayerInput()
        {
            if (IsFinished) throw new InvalidOperationException("Battle finished.");
            if (CurrentTurn != TeamSide.Player) throw new InvalidOperationException("Not player turn.");
            if (Phase != BattlePhase.SelectAction && Phase != BattlePhase.StartTurn)
            {
                throw new InvalidOperationException($"Invalid phase: {Phase}");
            }
        }

        private ActionResolution ResolveAction(TeamSide actor, ActionType action)
        {
            FighterStats source = actor == TeamSide.Player ? _player : _enemy;
            FighterStats target = actor == TeamSide.Player ? _enemy : _player;

            switch (action)
            {
                case ActionType.Attack:
                    return ResolveAttack(actor, source, target);
                case ActionType.Heal:
                    return ResolveHeal(actor, source);
                case ActionType.Escape:
                    return ResolveEscape(actor, source);
                default:
                    throw new ArgumentOutOfRangeException(nameof(action), action, null);
            }
        }

        private ActionResolution ResolveAttack(TeamSide actor, FighterStats source, FighterStats target)
        {
            int d20 = RollD20();
            bool crit = d20 >= source.CritThreshold;
            int baseDamage = Math.Max(1, source.Atk - target.Def);
            int damage = crit ? baseDamage * 2 : baseDamage;
            target.CurrentHp = Math.Max(0, target.CurrentHp - damage);
            bool ko = target.CurrentHp <= 0;

            return new ActionResolution
            {
                Type = ActionType.Attack,
                Actor = actor,
                Target = actor == TeamSide.Player ? TeamSide.Enemy : TeamSide.Player,
                D20Roll = d20,
                PredictedDamage = damage,
                AppliedDamage = damage,
                IsCritical = crit,
                IsKo = ko,
                LogLine = $"{actor} ataca por {damage} (d20:{d20})"
            };
        }

        private ActionResolution ResolveHeal(TeamSide actor, FighterStats source)
        {
            int heal = source.HealPower;
            int before = source.CurrentHp;
            source.CurrentHp = Math.Min(source.MaxHp, source.CurrentHp + heal);
            int applied = source.CurrentHp - before;

            return new ActionResolution
            {
                Type = ActionType.Heal,
                Actor = actor,
                Target = actor,
                HealAmount = applied,
                LogLine = $"{actor} cura {applied}"
            };
        }

        private ActionResolution ResolveEscape(TeamSide actor, FighterStats source)
        {
            bool escaped = _rng.NextDouble() < source.EscapeChance;
            if (escaped)
            {
                IsFinished = true;
                Winner = actor == TeamSide.Player ? TeamSide.Enemy : TeamSide.Player;
                Phase = BattlePhase.Result;
            }

            return new ActionResolution
            {
                Type = ActionType.Escape,
                Actor = actor,
                Target = actor,
                Escaped = escaped,
                LogLine = escaped ? $"{actor} escapa" : $"{actor} no puede escapar"
            };
        }

        private void PostResolve(ActionResolution resolution)
        {
            LastResolution = resolution;

            if (_player.CurrentHp <= 0)
            {
                IsFinished = true;
                Winner = TeamSide.Enemy;
                Phase = BattlePhase.Result;
                return;
            }

            if (_enemy.CurrentHp <= 0)
            {
                IsFinished = true;
                Winner = TeamSide.Player;
                Phase = BattlePhase.Result;
                return;
            }

            if (IsFinished)
            {
                Phase = BattlePhase.Result;
                return;
            }

            Phase = BattlePhase.EndTurn;
            CurrentTurn = CurrentTurn == TeamSide.Player ? TeamSide.Enemy : TeamSide.Player;
            Phase = BattlePhase.StartTurn;
            Phase = BattlePhase.SelectAction;
        }

        private int RollD20()
        {
            return _rng.Next(1, 21);
        }

        private static FighterStats Clone(FighterStats source)
        {
            return new FighterStats
            {
                Id = source.Id,
                MaxHp = source.MaxHp,
                CurrentHp = source.CurrentHp,
                Atk = source.Atk,
                Def = source.Def,
                CritThreshold = source.CritThreshold,
                HealPower = source.HealPower,
                EscapeChance = source.EscapeChance
            };
        }
    }
}
