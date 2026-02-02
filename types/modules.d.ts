declare module "bcryptjs" {
  export function hash(s: string, salt: number | string): Promise<string>;
  export function compare(s: string, hash: string): Promise<boolean>;
}

declare module "pdfkit" {
  import type { Readable } from "stream";
  export default class PDFDocument extends Readable {
    constructor(options?: Record<string, unknown>);
    font(name: string): this;
    fontSize(size: number): this;
    text(text: string, options?: Record<string, unknown>): this;
    moveDown(n?: number): this;
    addPage(): this;
    page: { width: number; margins: { left: number; right: number } };
    end(): void;
  }
}
