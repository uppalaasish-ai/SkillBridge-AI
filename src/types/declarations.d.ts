declare module 'mammoth' {
  export interface MammothResult {
    value: string;
    messages: any[];
  }
  export function extractRawText(options: { buffer?: Buffer; arrayBuffer?: ArrayBuffer }): Promise<MammothResult>;
  export function convertToHtml(options: { buffer?: Buffer; arrayBuffer?: ArrayBuffer }): Promise<MammothResult>;
  const mammoth: {
    extractRawText: typeof extractRawText;
    convertToHtml: typeof convertToHtml;
  };
  export default mammoth;
}
