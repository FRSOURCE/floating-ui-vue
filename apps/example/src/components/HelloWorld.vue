<script setup lang="ts">
import { ref } from "vue";
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
  <button
    :ref="
      (el) => {
        reference = el;
      }
    "
  >
    Button
  </button>
  <div
    :ref="
      (el) => {
        floating = el;
      }
    "
    :style="{
      position: strategy,
      top: `${y ?? 0}px`,
      left: `${x ?? 0}px`,
      whiteSpace: 'nowrap',
    }"
  >
    Tooltip Tooltip Tooltip Tooltip Tooltip Tooltip Tooltip Tooltip Tooltip
  </div>
  <div></div>
</template>
