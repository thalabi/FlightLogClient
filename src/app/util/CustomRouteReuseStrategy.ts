import { ActivatedRouteSnapshot, RouteReuseStrategy, DetachedRouteHandle } from "@angular/router";

export class DefaultRouteReuseStrategy implements RouteReuseStrategy {
    shouldDetach(route: ActivatedRouteSnapshot): boolean { return false; }
    store(route: ActivatedRouteSnapshot, detachedTree: DetachedRouteHandle): void {}
    shouldAttach(route: ActivatedRouteSnapshot): boolean { return false; }
    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle|null { return null; }
    shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        return future.routeConfig === curr.routeConfig;
    }
}

export class CustomRouteReuseStrategy extends DefaultRouteReuseStrategy  {

    readonly DO_NOT_REUSE_COMPONENTS: Array<string> = ['GenericCrudComponent'];

    // TODO not sure what is future and current
    // The output from the log stmts below does not make sense
    shouldReuseRoute(future: ActivatedRouteSnapshot, current: ActivatedRouteSnapshot): any {
        // console.log('future: ', future, ', current: ', current);
        if (current && current.routeConfig && current.routeConfig.component && current.routeConfig.component.name) {
            console.log('current component name: ', current.routeConfig.component.name)
        }
        if (future && future.routeConfig && future.routeConfig.component && future.routeConfig.component.name) {
            console.log('future component name: ', future.routeConfig.component.name)
        }

        let componentName: string  = future.component && (<any>future.component).name;
        console.log('future component name is in DO_NOT_REUSE_COMPONENTS: ', this.DO_NOT_REUSE_COMPONENTS.includes(componentName));
        return super.shouldReuseRoute(future, current) && ! this.DO_NOT_REUSE_COMPONENTS.includes(componentName);
    }
}

