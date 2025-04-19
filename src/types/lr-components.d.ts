import * as LR from '@uploadcare/blocks';
import { DetailedHTMLProps, HTMLAttributes } from 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'lr-config': DetailedHTMLProps<
        HTMLAttributes<HTMLElement> & {
          'ctx-name': string;
          pubkey: string;
        },
        HTMLElement
      >;
      'lr-file-uploader-regular': DetailedHTMLProps<
        HTMLAttributes<HTMLElement> & {
          'ctx-name': string;
          'css-src': string;
        },
        HTMLElement
      >;
      'lr-upload-ctx-provider': DetailedHTMLProps<
        HTMLAttributes<HTMLElement> & {
          'ctx-name': string;
          ref?: React.Ref<InstanceType<typeof LR.UploadCtxProvider>>;
        },
        HTMLElement
      >;
    }
  }
}
