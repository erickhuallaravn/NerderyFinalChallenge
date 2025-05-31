"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateShopCartItemInput = void 0;
var graphql_1 = require("@nestjs/graphql");
var UpdateShopCartItemInput = function () {
    var _classDecorators = [(0, graphql_1.InputType)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _cartItemId_decorators;
    var _cartItemId_initializers = [];
    var _cartItemId_extraInitializers = [];
    var _quantity_decorators;
    var _quantity_initializers = [];
    var _quantity_extraInitializers = [];
    var UpdateShopCartItemInput = _classThis = /** @class */ (function () {
        function UpdateShopCartItemInput_1() {
            this.cartItemId = __runInitializers(this, _cartItemId_initializers, void 0);
            this.quantity = (__runInitializers(this, _cartItemId_extraInitializers), __runInitializers(this, _quantity_initializers, void 0));
            __runInitializers(this, _quantity_extraInitializers);
        }
        return UpdateShopCartItemInput_1;
    }());
    __setFunctionName(_classThis, "UpdateShopCartItemInput");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _cartItemId_decorators = [(0, graphql_1.Field)(function () { return String; })];
        _quantity_decorators = [(0, graphql_1.Field)(function () { return graphql_1.Int; })];
        __esDecorate(null, null, _cartItemId_decorators, { kind: "field", name: "cartItemId", static: false, private: false, access: { has: function (obj) { return "cartItemId" in obj; }, get: function (obj) { return obj.cartItemId; }, set: function (obj, value) { obj.cartItemId = value; } }, metadata: _metadata }, _cartItemId_initializers, _cartItemId_extraInitializers);
        __esDecorate(null, null, _quantity_decorators, { kind: "field", name: "quantity", static: false, private: false, access: { has: function (obj) { return "quantity" in obj; }, get: function (obj) { return obj.quantity; }, set: function (obj, value) { obj.quantity = value; } }, metadata: _metadata }, _quantity_initializers, _quantity_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        UpdateShopCartItemInput = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return UpdateShopCartItemInput = _classThis;
}();
exports.UpdateShopCartItemInput = UpdateShopCartItemInput;
