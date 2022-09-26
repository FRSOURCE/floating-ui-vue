import { autoUpdate, computePosition } from '@floating-ui/dom';
import { Ref, ref, watch, onScopeDispose, computed, reactive } from 'vue';
import { MaybeElement, resolveRef, unrefElement, UnRefElementReturn } from '@vueuse/core';
import type { MaybeRef } from '@vueuse/core';
import type { ComputePositionReturn, ComputePositionConfig } from '@floating-ui/dom';

const createFloatingUIInstance = async (
  referenceElement: UnRefElementReturn<MaybeElement>,
  floatingElement: UnRefElementReturn<MaybeElement>,
  options: Ref<Partial<ComputePositionConfig>>,
) => {
  if (!referenceElement || !(floatingElement instanceof HTMLElement)) return;

  const instance = ref<ComputePositionReturn>();

  const update = async () =>
    instance.value = await computePosition(referenceElement, floatingElement, options.value);

  const cleanup = autoUpdate(referenceElement, floatingElement, update);

  watch(options, update);

  return reactive({ cleanup, instance, update });
};

export const useFloating = (options: MaybeRef<Partial<ComputePositionConfig>> = {}) => {
  const referenceRef = ref<MaybeElement>();
  const floatingRef = ref<MaybeElement>();

  const optionsInternal = resolveRef(options);
  const floatingInstance = ref<Awaited<ReturnType<typeof createFloatingUIInstance>>>();

  watch(
    [referenceRef, floatingRef] as const,
    async ([referenceRef, floatingRef]) => {
      floatingInstance.value?.cleanup();

      floatingInstance.value = await createFloatingUIInstance(unrefElement(referenceRef), unrefElement(floatingRef), optionsInternal);
    },
    {immediate: true}
  );

  onScopeDispose(() => floatingInstance.value?.cleanup());

  return {
    cleanup: computed(() => floatingInstance.value?.cleanup),
    update: computed(() => floatingInstance.value?.update),
    x: computed(() => floatingInstance.value?.instance?.x),
    y: computed(() => floatingInstance.value?.instance?.y),
    reference: referenceRef,
    floating: floatingRef,
    placement: computed(() => floatingInstance.value?.instance?.placement),
    strategy: computed(() => floatingInstance.value?.instance?.strategy),
    middlewareData: computed(() => floatingInstance.value?.instance?.middlewareData)
  };
};

export * from '@floating-ui/dom';
