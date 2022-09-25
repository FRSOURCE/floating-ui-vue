import { autoUpdate, computePosition } from '@floating-ui/dom';
import { Ref, ref, watch, ComponentPublicInstance, onScopeDispose, computed, reactive } from 'vue';
import { resolveRef, unrefElement } from '@vueuse/core';
import type { MaybeElementRef, MaybeRef } from '@vueuse/core';
import type {  ComputePositionReturn, ComputePositionConfig } from '@floating-ui/dom';

type ElementOrComponentRef = Ref<HTMLElement | ComponentPublicInstance | undefined>;
type InstanceWithCleanupType = { cleanup: ReturnType<typeof autoUpdate>, instance: ComputePositionReturn | undefined };
const createFloatingUIInstance = async (
  referenceRef: ElementOrComponentRef,
  floatingRef: ElementOrComponentRef,
  options: Ref<Partial<ComputePositionConfig>>,
) : Promise<undefined | InstanceWithCleanupType> => {
  const referenceElement = unrefElement(referenceRef as MaybeElementRef);
  const floatingElement = unrefElement(floatingRef as MaybeElementRef);
  if (!referenceElement || !floatingElement || !(floatingElement instanceof HTMLElement)) {return;}

  const instance = ref<ComputePositionReturn>();

  const cleanup = autoUpdate(referenceElement, floatingElement, async () => {
    instance.value = await computePosition(referenceElement, floatingElement, options.value).catch(e => e);
  });

  return reactive({ cleanup, instance });
};

export const useFloating = (options: MaybeRef<Partial<ComputePositionConfig>> = {}) => {
  const referenceRef = ref<HTMLElement>();
  const floatingRef = ref<HTMLElement>();

  const optionsInternal = resolveRef(options);
  const floatingInstance = ref<InstanceWithCleanupType | undefined>();

  watch(
    [referenceRef, floatingRef] as const,
    async () => {
      if(unrefElement(referenceRef) || unrefElement(floatingRef)) {
        console.log(options);
        floatingInstance.value = await createFloatingUIInstance(referenceRef, floatingRef, optionsInternal);
      } else {
        floatingInstance.value?.cleanup();
      }
    }, {immediate: true});

  onScopeDispose(() => floatingInstance.value?.cleanup());

  return {
    cleanup: computed(() => floatingInstance.value?.cleanup),
    x: computed(() => floatingInstance.value?.instance?.x),
    y: computed(() => floatingInstance.value?.instance?.y),
    reference: referenceRef,
    floating: floatingRef,
    strategy: computed(() => floatingInstance.value?.instance?.strategy)
  };
};

export * from '@floating-ui/dom';
