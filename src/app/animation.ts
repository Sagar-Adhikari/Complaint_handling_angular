import {
    trigger,
    animate,
    transition,
    style,
    state,
    query,
    group
} from '@angular/animations';

export const showHideAnimation =
    trigger('showHideAnimation', [
        state('true', style({ opacity: 1 })),
        state('false', style({ opacity: 0 })),
        transition('0=>1', animate('.90s')),
        transition('1=>0', animate('.90s')),

    ]);


export const fader =
    trigger('routeAnimations', [
        transition('* => *', [
            query(
                ':enter',
                [style({
                    opacity: 0
                })],
                { optional: true }
            ),
            query(
                ':leave',
                [style({
                    opacity: 1
                }), animate('0.20s', style({ opacity: 0 }))],
                { optional: true }
            ),
            query(
                ':enter',
                [style({
                    opacity: 0
                }), animate('0.3s', style({ opacity: 1 }))],
                { optional: true }
            )
        ])
    ]);


export const zoomer =
    trigger('routeAnimations', [
        transition('* <=> *', [
            // Set a default  style for enter and leave
            query(':enter, :leave', [
                style({
                    position: 'absolute',
                    left: 0,
                    width: '100%',
                    opacity: 0,
                    transform: 'scale(0) translateY(100%)',
                }),
            ],
                { optional: true }),
            // Animate the new page in
            query(':enter', [
                animate('600ms ease',
                    style({ opacity: 1, transform: 'scale(1) translateY(0)' })),

            ], { optional: true })
        ]),
    ]);

export const slider =
    trigger('routeAnimations', [
        transition('* => isLeft', slideTo('left')),
        transition('* => isRight', slideTo('right')),
        transition('isRight => *', slideTo('left')),
        transition('isLeft => *', slideTo('right'))
    ]);

function slideTo(direction) {
    const optional = { optional: true };
    return [
        query(':enter, :leave', [
            style({
                position: 'absolute',
                top: 0,
                [direction]: 0,
                width: '100%'
            })
        ], optional),
        query(':enter', [
            style({ [direction]: '-100%' })
        ]),
        group([
            query(':leave', [
                animate('600ms ease', style({ [direction]: '100%' }))
            ], optional),
            query(':enter', [
                animate('600ms ease', style({ [direction]: '0%' }))
            ])
        ]),
    ];
}