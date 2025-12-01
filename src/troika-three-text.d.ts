declare module 'troika-three-text' {
    import { Object3D } from 'three';

    export class Text extends Object3D {
        text: string;
        fontSize: number;
        color: number | string;
        anchorX: 'left' | 'center' | 'right';
        anchorY: 'top' | 'middle' | 'bottom';
        outlineWidth: number;
        outlineColor: number | string;
        fillOpacity: number;
        outlineOpacity: number;
        font: string;

        sync(): void;
        dispose(): void;
    }
}
