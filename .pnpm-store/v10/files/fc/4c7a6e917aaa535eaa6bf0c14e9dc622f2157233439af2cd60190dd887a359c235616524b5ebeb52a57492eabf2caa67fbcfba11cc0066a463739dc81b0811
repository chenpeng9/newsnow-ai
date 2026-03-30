export type LogoResponse = ImageInfo[];
declare const sourceDevices: readonly ["desktop", "mobile"];
export type SourceDevice = typeof sourceDevices[number];
export type SourceDeviceOptions = `${SourceDevice}` | `${SourceDevice} ${SourceDevice}`;
export type ImageInfo = {
    size: {
        width: number;
        height: number;
    };
    type: string;
    mime: string;
    src: string;
    device: SourceDevice;
};
export type Options = {
    devices?: SourceDeviceOptions;
};
export declare const getLogos: (url: string, options?: Options) => Promise<LogoResponse>;
export {};
