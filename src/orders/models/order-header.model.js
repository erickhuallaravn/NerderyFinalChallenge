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
exports.OrderHeader = void 0;
var graphql_1 = require("@nestjs/graphql");
var customer_model_1 = require("../../customer/customer.model");
var order_item_model_1 = require("./order-item.model");
var order_header_status_model_1 = require("./order-header-status.model");
var OrderHeader = function () {
    var _classDecorators = [(0, graphql_1.ObjectType)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _customer_decorators;
    var _customer_initializers = [];
    var _customer_extraInitializers = [];
    var _subtotal_decorators;
    var _subtotal_initializers = [];
    var _subtotal_extraInitializers = [];
    var _orderItems_decorators;
    var _orderItems_initializers = [];
    var _orderItems_extraInitializers = [];
    var _orderHeaderStatus_decorators;
    var _orderHeaderStatus_initializers = [];
    var _orderHeaderStatus_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    var _updatedAt_decorators;
    var _updatedAt_initializers = [];
    var _updatedAt_extraInitializers = [];
    var OrderHeader = _classThis = /** @class */ (function () {
        function OrderHeader_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.customer = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _customer_initializers, void 0));
            this.subtotal = (__runInitializers(this, _customer_extraInitializers), __runInitializers(this, _subtotal_initializers, void 0));
            this.orderItems = (__runInitializers(this, _subtotal_extraInitializers), __runInitializers(this, _orderItems_initializers, void 0));
            this.orderHeaderStatus = (__runInitializers(this, _orderItems_extraInitializers), __runInitializers(this, _orderHeaderStatus_initializers, void 0));
            this.createdAt = (__runInitializers(this, _orderHeaderStatus_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
        return OrderHeader_1;
    }());
    __setFunctionName(_classThis, "OrderHeader");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, graphql_1.Field)(function () { return graphql_1.ID; })];
        _customer_decorators = [(0, graphql_1.Field)(function () { return customer_model_1.Customer; })];
        _subtotal_decorators = [(0, graphql_1.Field)()];
        _orderItems_decorators = [(0, graphql_1.Field)(function () { return [order_item_model_1.OrderItem]; }, { nullable: true })];
        _orderHeaderStatus_decorators = [(0, graphql_1.Field)(function () { return [order_header_status_model_1.OrderHeaderStatus]; }, { nullable: true })];
        _createdAt_decorators = [(0, graphql_1.Field)()];
        _updatedAt_decorators = [(0, graphql_1.Field)({ nullable: true })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _customer_decorators, { kind: "field", name: "customer", static: false, private: false, access: { has: function (obj) { return "customer" in obj; }, get: function (obj) { return obj.customer; }, set: function (obj, value) { obj.customer = value; } }, metadata: _metadata }, _customer_initializers, _customer_extraInitializers);
        __esDecorate(null, null, _subtotal_decorators, { kind: "field", name: "subtotal", static: false, private: false, access: { has: function (obj) { return "subtotal" in obj; }, get: function (obj) { return obj.subtotal; }, set: function (obj, value) { obj.subtotal = value; } }, metadata: _metadata }, _subtotal_initializers, _subtotal_extraInitializers);
        __esDecorate(null, null, _orderItems_decorators, { kind: "field", name: "orderItems", static: false, private: false, access: { has: function (obj) { return "orderItems" in obj; }, get: function (obj) { return obj.orderItems; }, set: function (obj, value) { obj.orderItems = value; } }, metadata: _metadata }, _orderItems_initializers, _orderItems_extraInitializers);
        __esDecorate(null, null, _orderHeaderStatus_decorators, { kind: "field", name: "orderHeaderStatus", static: false, private: false, access: { has: function (obj) { return "orderHeaderStatus" in obj; }, get: function (obj) { return obj.orderHeaderStatus; }, set: function (obj, value) { obj.orderHeaderStatus = value; } }, metadata: _metadata }, _orderHeaderStatus_initializers, _orderHeaderStatus_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: function (obj) { return "updatedAt" in obj; }, get: function (obj) { return obj.updatedAt; }, set: function (obj, value) { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        OrderHeader = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return OrderHeader = _classThis;
}();
exports.OrderHeader = OrderHeader;
