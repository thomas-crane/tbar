import { Readable, Writable } from 'stream';

export class FakeReadable extends Readable {
  private _queue: string;

  enqueue(string: string): void;
}
export class FakeWritable extends Writable {
  text: string;
}
