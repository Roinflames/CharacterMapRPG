using UnityEngine;

namespace CharacterMapRPG.BattleCore
{
    public sealed class AudioManager : MonoBehaviour
    {
        public static AudioManager Instance { get; private set; }

        [Header("Sources")]
        [SerializeField] private AudioSource sfxSource;
        [SerializeField] private AudioSource musicSource;

        [Header("SFX")]
        [SerializeField] private AudioClip uiClickClip;
        [SerializeField] private AudioClip hitClip;
        [SerializeField] private AudioClip critClip;
        [SerializeField] private AudioClip healClip;
        [SerializeField] private AudioClip escapeClip;
        [SerializeField] private AudioClip enemyKoClip;
        [SerializeField] private AudioClip playerKoClip;

        [Header("Music")]
        [SerializeField] private AudioClip battleLoopClip;
        [SerializeField] [Range(0f, 1f)] private float musicVolume = 0.22f;
        [SerializeField] [Range(0f, 1f)] private float sfxVolume = 0.88f;

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }

            Instance = this;
            DontDestroyOnLoad(gameObject);
            EnsureSources();
            ConfigureMusic();
        }

        public void PlayUiClick() => PlaySfx(uiClickClip);
        public void PlayHit() => PlaySfx(hitClip);
        public void PlayCrit() => PlaySfx(critClip ? critClip : hitClip);
        public void PlayHeal() => PlaySfx(healClip);
        public void PlayEscape() => PlaySfx(escapeClip);
        public void PlayEnemyKo() => PlaySfx(enemyKoClip);
        public void PlayPlayerKo() => PlaySfx(playerKoClip);

        public void SetSfxVolume(float value)
        {
            sfxVolume = Mathf.Clamp01(value);
            if (sfxSource) sfxSource.volume = sfxVolume;
        }

        public void SetMusicVolume(float value)
        {
            musicVolume = Mathf.Clamp01(value);
            if (musicSource) musicSource.volume = musicVolume;
        }

        private void EnsureSources()
        {
            if (!sfxSource)
            {
                sfxSource = gameObject.AddComponent<AudioSource>();
                sfxSource.playOnAwake = false;
                sfxSource.loop = false;
                sfxSource.spatialBlend = 0f;
            }

            if (!musicSource)
            {
                musicSource = gameObject.AddComponent<AudioSource>();
                musicSource.playOnAwake = false;
                musicSource.loop = true;
                musicSource.spatialBlend = 0f;
            }

            sfxSource.volume = sfxVolume;
            musicSource.volume = musicVolume;
        }

        private void ConfigureMusic()
        {
            if (!musicSource) return;
            musicSource.clip = battleLoopClip;
            musicSource.volume = musicVolume;
            if (battleLoopClip && !musicSource.isPlaying)
            {
                musicSource.Play();
            }
        }

        private void PlaySfx(AudioClip clip)
        {
            if (!clip || !sfxSource) return;
            sfxSource.PlayOneShot(clip, sfxVolume);
        }
    }
}
