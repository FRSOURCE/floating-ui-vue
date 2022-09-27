<script setup lang="ts">
import { useFloating, flip } from "@frsource/floating-ui-vue-dom";

const { x, y, reference, floating, strategy } = useFloating({
  placement: "right",
  middleware: [
    flip({
      fallbackPlacements: ["bottom"],
    }),
  ],
});
</script>

<template>
  <h5>Tooltip position:</h5>
  <p>x: {{ x }} y: {{ y }}</p>
  <button ref="reference">Button</button>
  <div
    ref="floating"
    :style="{
      position: strategy,
      top: `${y ?? 0}px`,
      left: `${x ?? 0}px`,
      whiteSpace: 'nowrap',
    }"
  >
    Tooltip Tooltip Tooltip Tooltip Tooltip Tooltip Tooltip Tooltip Tooltip
  </div>
</template>
