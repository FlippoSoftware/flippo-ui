export enum MarqueeRootCssVars {
    /**
     * `paused` when the marquee pauses on hover (or does not play), else `running`: the `animation-play-state` of the track on hover.
     */
    PauseOnHover = '--marquee-pause-on-hover',
    /**
     * `paused` when the marquee pauses while pressed (or does not play), else `running`: the `animation-play-state` of the track while pressed.
     */
    PauseOnClick = '--marquee-pause-on-click',
    /**
     * `running` or `paused`: the `animation-play-state` of the track.
     */
    Play = '--marquee-play',
    /**
     * `normal` or `reverse`: the `animation-direction` of the track.
     */
    Direction = '--marquee-direction',
    /**
     * `horizontal` or `vertical`.
     */
    Orientation = '--marquee-orientation',
    /**
     * The duration of one cycle, from the speed and the size of the content.
     */
    Duration = '--marquee-duration',
    /**
     * The delay before the animation starts.
     */
    Delay = '--marquee-delay',
    /**
     * The number of cycles (`infinite` without `loop`): the `animation-iteration-count` of the track.
     */
    IterationCount = '--marquee-iteration-count',
    /**
     * The minimum width of the track: `auto` with `autoFill`, else `100%` (horizontal marquees).
     */
    MinWidth = '--marquee-min-width'
}
