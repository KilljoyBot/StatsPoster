export { join as pathJoin } from "https://deno.land/std@0.101.0/path/mod.ts";
export { Client } from "https://deno.land/x/postgres@0.11.3/mod.ts";
export * as redis from "https://deno.land/x/redis@v0.25.3/mod.ts";

export function chunk(array: any[], size = 1) {
    let chunkedValues = [];
    for (let i = 0; i < array.length; i += size) {
      let group = [];
      // prevents the loop from adding undefined values in the group array
      let length = i + size > array.length ? array.length : i + size;
      for (let j = i; j < length; j++) {
        group.push(array[j]);
      }
      chunkedValues.push(group);
    }
    return chunkedValues;
}