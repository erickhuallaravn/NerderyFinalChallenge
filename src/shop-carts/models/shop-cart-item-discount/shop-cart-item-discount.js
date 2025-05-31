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
exports.ShopCartItemDiscount = void 0;
var graphql_1 = require("@nestjs/graphql");
var ShopCartItemDiscount = function () {
    var _classDecorators = [(0, graphql_1.ObjectType)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _requiredAmount_decorators;
    var _requiredAmount_initializers = [];
    var _requiredAmount_extraInitializers = [];
    var _discountPercentage_decorators;
    var _discountPercentage_initializers = [];
    var _discountPercentage_extraInitializers = [];
    var _bonusQuantity_decorators;
    var _bonusQuantity_initializers = [];
    var _bonusQuantity_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    var _updatedAt_decorators;
    var _updatedAt_initializers = [];
    var _updatedAt_extraInitializers = [];
    var ShopCartItemDiscount = _classThis = /** @class */ (function () {
        function ShopCartItemDiscount_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.requiredAmount = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _requiredAmount_initializers, void 0));
            this.discountPercentage = (__runInitializers(this, _requiredAmount_extraInitializers), __runInitializers(this, _discountPercentage_initializers, void 0));
            this.bonusQuantity = (__runInitializers(this, _discountPercentage_extraInitializers), __runInitializers(this, _bonusQuantity_initializers, void 0));
            this.createdAt = (__runInitializers(this, _bonusQuantity_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
        return ShopCartItemDiscount_1;
    }());
    __setFunctionName(_classThis, "ShopCartItemDiscount");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, graphql_1.Field)(function () { return graphql_1.ID; })];
        _requiredAmount_decorators = [(0, graphql_1.Field)(function () { return graphql_1.Int; })];
        _discountPercentage_decorators = [(0, graphql_1.Field)({ nullable: true })];
        _bonusQuantity_decorators = [(0, graphql_1.Field)({ nullable: true })];
        _createdAt_decorators = [(0, graphql_1.Field)(function () { return Date; })];
        _updatedAt_decorators = [(0, graphql_1.Field)(function () { return Date; }, { nullable: true })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _requiredAmount_decorators, { kind: "field", name: "requiredAmount", static: false, private: false, access: { has: function (obj) { return "requiredAmount" in obj; }, get: function (obj) { return obj.requiredAmount; }, set: function (obj, value) { obj.requiredAmount = value; } }, metadata: _metadata }, _requiredAmount_initializers, _requiredAmount_extraInitializers);
        __esDecorate(null, null, _discountPercentage_decorators, { kind: "field", name: "discountPercentage", static: false, private: false, access: { has: function (obj) { return "discountPercentage" in obj; }, get: function (obj) { return obj.discountPercentage; }, set: function (obj, value) { obj.discountPercentage = value; } }, metadata: _metadata }, _discountPercentage_initializers, _discountPercentage_extraInitializers);
        __esDecorate(null, null, _bonusQuantity_decorators, { kind: "field", name: "bonusQuantity", static: false, private: false, access: { has: function (obj) { return "bonusQuantity" in obj; }, get: function (obj) { return obj.bonusQuantity; }, set: function (obj, value) { obj.bonusQuantity = value; } }, metadata: _metadata }, _bonusQuantity_initializers, _bonusQuantity_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: function (obj) { return "updatedAt" in obj; }, get: function (obj) { return obj.updatedAt; }, set: function (obj, value) { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ShopCartItemDiscount = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ShopCartItemDiscount = _classThis;
}();
exports.ShopCartItemDiscount = ShopCartItemDiscount;
