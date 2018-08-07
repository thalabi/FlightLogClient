import { ActivatedRouteSnapshot, RouteReuseStrategy, DetachedRouteHandle } from "@angular/router";
import { GenericCrudComponent } from "../generic-crud/generic-crud.component";

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

    readonly DO_NOT_REUSE_COMPONENTS: Array<any> = [GenericCrudComponent];

    // TODO not sure what is future and current
    // The output from the log stmts below does not make sense
    shouldReuseRoute(future: ActivatedRouteSnapshot, current: ActivatedRouteSnapshot): any {
        if (current && current.routeConfig && current.routeConfig.component) {
            console.log('current component: ', current.routeConfig.component);
        }
        if (future && future.routeConfig && future.routeConfig.component) {
            console.log('future component: ', future.routeConfig.component)
        }

        console.log('future component name is in DO_NOT_REUSE_COMPONENTS: ', this.DO_NOT_REUSE_COMPONENTS.includes(future.component));
        return super.shouldReuseRoute(future, current) && ! this.DO_NOT_REUSE_COMPONENTS.includes(future.component);
    }
}

