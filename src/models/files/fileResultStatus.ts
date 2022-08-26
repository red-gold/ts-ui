import { SocialError } from 'core/domain/common/socialError';
import { FileResult } from './fileResult';

export class FileResultStatus {
    progress: number;

    success: FileResult;

    error: SocialError;

    fileName: string;

    meta: any;
}
