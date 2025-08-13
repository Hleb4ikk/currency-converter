import { Response } from 'express';

export interface ResponseWithLocals extends Response {
  locals: Record<string, string>;
}
