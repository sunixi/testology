import { trigger, state, style, transition, animate, keyframes } from '@angular/animations'

export const dislike = trigger('dislike', [
    state('default', style({ transform: 'scale(1)' })),
    state('like', style({ opacity: 0.5, transform: 'scale(0.8)' })),
    transition('void => like', animate('0')),
    transition('* => default', animate('.5s linear')),
    transition('* => like', animate('.5s linear', keyframes([
        style({ opacity: 1, transform: 'scale(1)', offset: 0}),
        style({ transform: 'scale(0.4)', offset: 0.5}),
        style({ transform: 'scale(0.8)', offset: 1})
    ])))
]);

export const like = trigger('like', [
    state('default', style({ transform: 'scale(1)' })),
    state('like', style({ transform: 'scale(1.2)' })),
    transition('void => like', animate('0')),
    transition('* => default', animate('.5s linear')),
    transition('* => like', animate('.5s linear', keyframes([
        style({ opacity: 1, transform: 'scale(1)', offset: 0}),
        style({ transform: 'scale(1.4)', offset: 0.5}),
        style({ transform: 'scale(1.2)', offset: 1})
    ])))
]);
