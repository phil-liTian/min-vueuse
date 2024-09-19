import { defineComponent, Fragment, h, ref } from "vue";
import { onClickOutside } from ".";

export const OnClickOutside = defineComponent({
  name: "OnClickOutside",
  emits: ["trigger"],
  props: ["as", "options"],
  setup(props, { slots, emit }) {
    const target = ref(null);

    onClickOutside(
      target,
      (e) => {
        emit("trigger", e);
      },
      props.options
    );

    return () => {
      if (slots.default) {
        return h(props.as || "div", { ref: target }, slots.default());
      }
    };
  },
});
