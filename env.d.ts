/// <reference types="vite/client" />
 
declare module "*.vue" {
    import Vue from 'vue'
    import {defineComponent} from 'vue'
    const Component:ReturnType<typeof defineComponent>
    export default Component
}
