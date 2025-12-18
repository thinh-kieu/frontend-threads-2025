## patches\html2canvas+1.4.1.patch

Steps to create the patch:

- pull the code from the PR https://github.com/niklasvh/html2canvas/pull/3218 (or the branch https://github.com/mmis1000/html2canvas/tree/feat/video-img-object-fit)
- build the code following the instruction of the repo
- copy the output `dist` to `node_modules\html2canvas\dist`
- run `npx patch-package html2canvas` to create the patch
