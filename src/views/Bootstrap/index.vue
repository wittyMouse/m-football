<template></template>

<script>
import { defineComponent } from "@vue/composition-api";
import { requestAuxiliaryRedirect } from "@/api";
import { useRouter } from "@/router";

export default defineComponent({
  name: "Bootstrap",
  setup() {
    const router = useRouter();

    const queryAuxiliaryRedirect = async () => {
      try {
        const { origin, pathname } = window.location;
        const queryData = { redirectUrl: `${origin}${pathname}` };
        const res = await requestAuxiliaryRedirect(queryData);
        const { token = "" } = res.result || {};
        if (res.code === 0 && token) {
          window.sessionStorage.setItem("auth_token", token);
          router.push("/home");
        }
      } catch (e) {
        console.log(e);
      }
    };

    queryAuxiliaryRedirect();
  },
});
</script>
