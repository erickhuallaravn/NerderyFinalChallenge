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
exports.OrderItemDiscount = void 0;
var graphql_1 = require("@nestjs/graphql");
var customer_model_1 = require("../../customer/customer.model");
var OrderItemDiscount = function () {
    var _classDecorators = [(0, graphql_1.ObjectType)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _orderDetailId_decorators;
    var _orderDetailId_initializers = [];
    var _orderDetailId_extraInitializers = [];
    var _promotionalDiscountId_decorators;
    var _promotionalDiscountId_initializers = [];
    var _promotionalDiscountId_extraInitializers = [];
    var _productName_decorators;
    var _productName_initializers = [];
    var _productName_extraInitializers = [];
    var _requiredAmount_decorators;
    var _requiredAmount_initializers = [];
    var _requiredAmount_extraInitializers = [];
    var _discountPercentage_decorators;
    var _discountPercentage_initializers = [];
    var _discountPercentage_extraInitializers = [];
    var _bonusQuantity_decorators;
    var _bonusQuantity_initializers = [];
    var _bonusQuantity_extraInitializers = [];
    var _customer_decorators;
    var _customer_initializers = [];
    var _customer_extraInitializers = [];
    var OrderItemDiscount = _classThis = /** @class */ (function () {
        function OrderItemDiscount_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.orderDetailId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _orderDetailId_initializers, void 0));
            this.promotionalDiscountId = (__runInitializers(this, _orderDetailId_extraInitializers), __runInitializers(this, _promotionalDiscountId_initializers, void 0));
            this.productName = (__runInitializers(this, _promotionalDiscountId_extraInitializers), __runInitializers(this, _productName_initializers, void 0));
            this.requiredAmount = (__runInitializers(this, _productName_extraInitializers), __runInitializers(this, _requiredAmount_initializers, void 0));
            this.discountPercentage = (__runInitializers(this, _requiredAmount_extraInitializers), __runInitializers(this, _discountPercentage_initializers, void 0));
            this.bonusQuantity = (__runInitializers(this, _discountPercentage_extraInitializers), __runInitializers(this, _bonusQuantity_initializers, void 0));
            this.customer = (__runInitializers(this, _bonusQuantity_extraInitializers), __runInitializers(this, _customer_initializers, void 0));
            __runInitializers(this, _customer_extraInitializers);
        }
        return OrderItemDiscount_1;
    }());
    __setFunctionName(_classThis, "OrderItemDiscount");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, graphql_1.Field)(function () { return graphql_1.ID; })];
        _orderDetailId_decorators = [(0, graphql_1.Field)()];
        _promotionalDiscountId_decorators = [(0, graphql_1.Field)()];
        _productName_decorators = [(0, graphql_1.Field)(function () { return String; })];
        _requiredAmount_decorators = [(0, graphql_1.Field)(function () { return graphql_1.Int; })];
        _discountPercentage_decorators = [(0, graphql_1.Field)()];
        _bonusQuantity_decorators = [(0, graphql_1.Field)(function () { return graphql_1.Int; })];
        _customer_decorators = [(0, graphql_1.Field)(function () { return customer_model_1.Customer; })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _orderDetailId_decorators, { kind: "field", name: "orderDetailId", static: false, private: false, access: { has: function (obj) { return "orderDetailId" in obj; }, get: function (obj) { return obj.orderDetailId; }, set: function (obj, value) { obj.orderDetailId = value; } }, metadata: _metadata }, _orderDetailId_initializers, _orderDetailId_extraInitializers);
        __esDecorate(null, null, _promotionalDiscountId_decorators, { kind: "field", name: "promotionalDiscountId", static: false, private: false, access: { has: function (obj) { return "promotionalDiscountId" in obj; }, get: function (obj) { return obj.promotionalDiscountId; }, set: function (obj, value) { obj.promotionalDiscountId = value; } }, metadata: _metadata }, _promotionalDiscountId_initializers, _promotionalDiscountId_extraInitializers);
        __esDecorate(null, null, _productName_decorators, { kind: "field", name: "productName", static: false, private: false, access: { has: function (obj) { return "productName" in obj; }, get: function (obj) { return obj.productName; }, set: function (obj, value) { obj.productName = value; } }, metadata: _metadata }, _productName_initializers, _productName_extraInitializers);
        __esDecorate(null, null, _requiredAmount_decorators, { kind: "field", name: "requiredAmount", static: false, private: false, access: { has: function (obj) { return "requiredAmount" in obj; }, get: function (obj) { return obj.requiredAmount; }, set: function (obj, value) { obj.requiredAmount = value; } }, metadata: _metadata }, _requiredAmount_initializers, _requiredAmount_extraInitializers);
        __esDecorate(null, null, _discountPercentage_decorators, { kind: "field", name: "discountPercentage", static: false, private: false, access: { has: function (obj) { return "discountPercentage" in obj; }, get: function (obj) { return obj.discountPercentage; }, set: function (obj, value) { obj.discountPercentage = value; } }, metadata: _metadata }, _discountPercentage_initializers, _discountPercentage_extraInitializers);
        __esDecorate(null, null, _bonusQuantity_decorators, { kind: "field", name: "bonusQuantity", static: false, private: false, access: { has: function (obj) { return "bonusQuantity" in obj; }, get: function (obj) { return obj.bonusQuantity; }, set: function (obj, value) { obj.bonusQuantity = value; } }, metadata: _metadata }, _bonusQuantity_initializers, _bonusQuantity_extraInitializers);
        __esDecorate(null, null, _customer_decorators, { kind: "field", name: "customer", static: false, private: false, access: { has: function (obj) { return "customer" in obj; }, get: function (obj) { return obj.customer; }, set: function (obj, value) { obj.customer = value; } }, metadata: _metadata }, _customer_initializers, _customer_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        OrderItemDiscount = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return OrderItemDiscount = _classThis;
}();
exports.OrderItemDiscount = OrderItemDiscount;
