import { directiveHooks } from "@mini-vueuse/shared";
import { useClipboard } from ".";
import { useEventListener } from "../useEventListener";


export const vCopy = {
  [directiveHooks.mounted](el, binding) {

    const { value, modifiers, arg } = binding;
    const { copy, copied } = useClipboard({ source: arg });
    console.log('arg', arg);
    el.style.cursor = 'pointer';

    useEventListener(el, 'click', () => copy(arg))
  }
}