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
exports.CreatePromotionalDiscountInput = void 0;
var graphql_1 = require("@nestjs/graphql");
var CreatePromotionalDiscountInput = function () {
    var _classDecorators = [(0, graphql_1.InputType)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _productVariationId_decorators;
    var _productVariationId_initializers = [];
    var _productVariationId_extraInitializers = [];
    var _discountType_decorators;
    var _discountType_initializers = [];
    var _discountType_extraInitializers = [];
    var _requiredAmount_decorators;
    var _requiredAmount_initializers = [];
    var _requiredAmount_extraInitializers = [];
    var _bonusQuantity_decorators;
    var _bonusQuantity_initializers = [];
    var _bonusQuantity_extraInitializers = [];
    var _discountPercentage_decorators;
    var _discountPercentage_initializers = [];
    var _discountPercentage_extraInitializers = [];
    var _validUntil_decorators;
    var _validUntil_initializers = [];
    var _validUntil_extraInitializers = [];
    var _availableStock_decorators;
    var _availableStock_initializers = [];
    var _availableStock_extraInitializers = [];
    var CreatePromotionalDiscountInput = _classThis = /** @class */ (function () {
        function CreatePromotionalDiscountInput_1() {
            this.name = __runInitializers(this, _name_initializers, void 0);
            this.productVariationId = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _productVariationId_initializers, void 0));
            this.discountType = (__runInitializers(this, _productVariationId_extraInitializers), __runInitializers(this, _discountType_initializers, void 0));
            this.requiredAmount = (__runInitializers(this, _discountType_extraInitializers), __runInitializers(this, _requiredAmount_initializers, void 0));
            this.bonusQuantity = (__runInitializers(this, _requiredAmount_extraInitializers), __runInitializers(this, _bonusQuantity_initializers, void 0));
            this.discountPercentage = (__runInitializers(this, _bonusQuantity_extraInitializers), __runInitializers(this, _discountPercentage_initializers, void 0));
            this.validUntil = (__runInitializers(this, _discountPercentage_extraInitializers), __runInitializers(this, _validUntil_initializers, void 0));
            this.availableStock = (__runInitializers(this, _validUntil_extraInitializers), __runInitializers(this, _availableStock_initializers, void 0));
            __runInitializers(this, _availableStock_extraInitializers);
        }
        return CreatePromotionalDiscountInput_1;
    }());
    __setFunctionName(_classThis, "CreatePromotionalDiscountInput");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _name_decorators = [(0, graphql_1.Field)()];
        _productVariationId_decorators = [(0, graphql_1.Field)()];
        _discountType_decorators = [(0, graphql_1.Field)(function () { return String; })];
        _requiredAmount_decorators = [(0, graphql_1.Field)()];
        _bonusQuantity_decorators = [(0, graphql_1.Field)({ nullable: true })];
        _discountPercentage_decorators = [(0, graphql_1.Field)({ nullable: true })];
        _validUntil_decorators = [(0, graphql_1.Field)({ nullable: true })];
        _availableStock_decorators = [(0, graphql_1.Field)({ nullable: true })];
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _productVariationId_decorators, { kind: "field", name: "productVariationId", static: false, private: false, access: { has: function (obj) { return "productVariationId" in obj; }, get: function (obj) { return obj.productVariationId; }, set: function (obj, value) { obj.productVariationId = value; } }, metadata: _metadata }, _productVariationId_initializers, _productVariationId_extraInitializers);
        __esDecorate(null, null, _discountType_decorators, { kind: "field", name: "discountType", static: false, private: false, access: { has: function (obj) { return "discountType" in obj; }, get: function (obj) { return obj.discountType; }, set: function (obj, value) { obj.discountType = value; } }, metadata: _metadata }, _discountType_initializers, _discountType_extraInitializers);
        __esDecorate(null, null, _requiredAmount_decorators, { kind: "field", name: "requiredAmount", static: false, private: false, access: { has: function (obj) { return "requiredAmount" in obj; }, get: function (obj) { return obj.requiredAmount; }, set: function (obj, value) { obj.requiredAmount = value; } }, metadata: _metadata }, _requiredAmount_initializers, _requiredAmount_extraInitializers);
        __esDecorate(null, null, _bonusQuantity_decorators, { kind: "field", name: "bonusQuantity", static: false, private: false, access: { has: function (obj) { return "bonusQuantity" in obj; }, get: function (obj) { return obj.bonusQuantity; }, set: function (obj, value) { obj.bonusQuantity = value; } }, metadata: _metadata }, _bonusQuantity_initializers, _bonusQuantity_extraInitializers);
        __esDecorate(null, null, _discountPercentage_decorators, { kind: "field", name: "discountPercentage", static: false, private: false, access: { has: function (obj) { return "discountPercentage" in obj; }, get: function (obj) { return obj.discountPercentage; }, set: function (obj, value) { obj.discountPercentage = value; } }, metadata: _metadata }, _discountPercentage_initializers, _discountPercentage_extraInitializers);
        __esDecorate(null, null, _validUntil_decorators, { kind: "field", name: "validUntil", static: false, private: false, access: { has: function (obj) { return "validUntil" in obj; }, get: function (obj) { return obj.validUntil; }, set: function (obj, value) { obj.validUntil = value; } }, metadata: _metadata }, _validUntil_initializers, _validUntil_extraInitializers);
        __esDecorate(null, null, _availableStock_decorators, { kind: "field", name: "availableStock", static: false, private: false, access: { has: function (obj) { return "availableStock" in obj; }, get: function (obj) { return obj.availableStock; }, set: function (obj, value) { obj.availableStock = value; } }, metadata: _metadata }, _availableStock_initializers, _availableStock_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CreatePromotionalDiscountInput = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CreatePromotionalDiscountInput = _classThis;
}();
exports.CreatePromotionalDiscountInput = CreatePromotionalDiscountInput;
