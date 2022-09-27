import { ComputePositionConfig, useFloating as usePosition } from '@frsource/floating-ui-vue-dom';
import { MaybeRef, resolveRef } from '@vueuse/core';
import { computed } from 'vue';

export const useFloating = (options: MaybeRef<Partial<ComputePositionConfig & { open: boolean }>>)=> {
  const optionsInternal = resolveRef(options);
  const open = computed(() => optionsInternal.value.open);
  const position = usePosition(options);

  return {
    ...position,
    context: {
      ...position,
      open
    },
  };
};

export type Context = ReturnType<typeof useFloating>['context'];
