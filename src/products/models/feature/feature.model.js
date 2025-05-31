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
exports.Feature = void 0;
var graphql_1 = require("@nestjs/graphql");
var option_value_model_1 = require("../option/option-value.model");
var product_variation_model_1 = require("../product-variation/product-variation.model");
var Feature = function () {
    var _classDecorators = [(0, graphql_1.ObjectType)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _optionValueId_decorators;
    var _optionValueId_initializers = [];
    var _optionValueId_extraInitializers = [];
    var _productVariationId_decorators;
    var _productVariationId_initializers = [];
    var _productVariationId_extraInitializers = [];
    var _optionValue_decorators;
    var _optionValue_initializers = [];
    var _optionValue_extraInitializers = [];
    var _productVariation_decorators;
    var _productVariation_initializers = [];
    var _productVariation_extraInitializers = [];
    var Feature = _classThis = /** @class */ (function () {
        function Feature_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.optionValueId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _optionValueId_initializers, void 0));
            this.productVariationId = (__runInitializers(this, _optionValueId_extraInitializers), __runInitializers(this, _productVariationId_initializers, void 0));
            this.optionValue = (__runInitializers(this, _productVariationId_extraInitializers), __runInitializers(this, _optionValue_initializers, void 0));
            this.productVariation = (__runInitializers(this, _optionValue_extraInitializers), __runInitializers(this, _productVariation_initializers, void 0));
            __runInitializers(this, _productVariation_extraInitializers);
        }
        return Feature_1;
    }());
    __setFunctionName(_classThis, "Feature");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, graphql_1.Field)(function () { return graphql_1.ID; })];
        _optionValueId_decorators = [(0, graphql_1.Field)()];
        _productVariationId_decorators = [(0, graphql_1.Field)()];
        _optionValue_decorators = [(0, graphql_1.Field)(function () { return option_value_model_1.OptionValue; })];
        _productVariation_decorators = [(0, graphql_1.Field)(function () { return product_variation_model_1.ProductVariation; })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _optionValueId_decorators, { kind: "field", name: "optionValueId", static: false, private: false, access: { has: function (obj) { return "optionValueId" in obj; }, get: function (obj) { return obj.optionValueId; }, set: function (obj, value) { obj.optionValueId = value; } }, metadata: _metadata }, _optionValueId_initializers, _optionValueId_extraInitializers);
        __esDecorate(null, null, _productVariationId_decorators, { kind: "field", name: "productVariationId", static: false, private: false, access: { has: function (obj) { return "productVariationId" in obj; }, get: function (obj) { return obj.productVariationId; }, set: function (obj, value) { obj.productVariationId = value; } }, metadata: _metadata }, _productVariationId_initializers, _productVariationId_extraInitializers);
        __esDecorate(null, null, _optionValue_decorators, { kind: "field", name: "optionValue", static: false, private: false, access: { has: function (obj) { return "optionValue" in obj; }, get: function (obj) { return obj.optionValue; }, set: function (obj, value) { obj.optionValue = value; } }, metadata: _metadata }, _optionValue_initializers, _optionValue_extraInitializers);
        __esDecorate(null, null, _productVariation_decorators, { kind: "field", name: "productVariation", static: false, private: false, access: { has: function (obj) { return "productVariation" in obj; }, get: function (obj) { return obj.productVariation; }, set: function (obj, value) { obj.productVariation = value; } }, metadata: _metadata }, _productVariation_initializers, _productVariation_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Feature = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Feature = _classThis;
}();
exports.Feature = Feature;
