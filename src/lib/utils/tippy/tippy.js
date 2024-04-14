import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light.css';
import './tippy.css';

// Anonimous function name to prevent collision with tippy import.
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export default function (node, options) {
    const instance = tippy(node, options);
    // Disable tippy if content is empty.
    if (!options?.content) {
        instance.disable();
    }
    return {
        update(newOptions) {
            instance.setProps(newOptions);
            // Disable tippy if content is empty and enable it if it is not.
            if (!newOptions?.content) {
                instance.disable();
            } else {
                instance.enable();
            }
        },
        destroy() {
            instance.destroy();
        }
    };
}
