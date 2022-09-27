import { DeepMaybeRef, MaybeRef, resolveRef, unrefElement, useElementHover, useMemoize } from "@vueuse/core";
import { computed, isRef, proxyRefs, Ref, ref, ShallowUnwrapRef, ToRefs, toRefs, unref, UnwrapRef, watch } from "vue";
import { Context } from "./useFloating";

type useHoverRawOptions = { enabled?: boolean; delay?: number; restMs?: number; move?: boolean; handleClose?: null | ReturnType<typeof safePolygon> };
export type useHoverOptions = DeepMaybeRef<useHoverRawOptions>;

const optionsToRefs = <OD extends object, D extends DeepMaybeRef<OD>, O extends UnwrapRef<D>>(options: D, defaults: O) => {
  if (isRef<O>(options)) {
    const optionsRef = options as Ref<O>;
    const optionGetter = (_target: ToRefs<O>, prop: string | symbol) =>
      computed({
        get: () => optionsRef.value[prop as keyof typeof optionsRef['value']] ?? defaults[prop as keyof typeof optionsRef['value']],
        set: (value) =>
          optionsRef.value = {...optionsRef.value, [prop]: value},
      });
    return new Proxy({} as ToRefs<O>, { get: optionGetter });
  }

  const optionsObj = options as ToRefs<O>;
  const optionGetter = (_target: ToRefs<O>, prop: string | symbol) => resolveRef(optionsObj[prop as keyof typeof optionsObj] ?? defaults[prop as keyof typeof optionsObj]);
  return new Proxy({} as ToRefs<O>, { get: optionGetter });
};

export const useHover = (context: Context, options: useHoverOptions) => {
  const { enabled, delay, restMs, move, handleClose } = optionsToRefs(options, { enabled: true, delay: 0, restMs: 0, move: true, handleClose: null });
  const timeoutRef = ref<number>();
  const blockMouseMoveRef = ref(true);

  watch(resolveRef(enabled), () => {
    useElementHover(computed(()=> unrefElement(context.reference)));

  }, {immediate: true});

  const onMouseEnter = (event: MouseEvent) => {
    clearTimeout(timeoutRef.value);
    blockMouseMoveRef.value = false;

    // if (restMs.value > 0 && )
  };
};

export const safePolygon = ({ restMs=0, buffer=0.5, blockPointerEvents=true, }: { restMs: number, buffer: number, blockPointerEvents:boolean}) => {
  // TODO: implement
};
