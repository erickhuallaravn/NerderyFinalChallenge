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
exports.CreateProductVariationInput = void 0;
var graphql_1 = require("@nestjs/graphql");
var update_variation_feature_input_1 = require("../variation/update-variation-feature.input");
var CreateProductVariationInput = function () {
    var _classDecorators = [(0, graphql_1.InputType)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _productId_decorators;
    var _productId_initializers = [];
    var _productId_extraInitializers = [];
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _price_decorators;
    var _price_initializers = [];
    var _price_extraInitializers = [];
    var _currencyCode_decorators;
    var _currencyCode_initializers = [];
    var _currencyCode_extraInitializers = [];
    var _availableStock_decorators;
    var _availableStock_initializers = [];
    var _availableStock_extraInitializers = [];
    var _features_decorators;
    var _features_initializers = [];
    var _features_extraInitializers = [];
    var CreateProductVariationInput = _classThis = /** @class */ (function () {
        function CreateProductVariationInput_1() {
            this.productId = __runInitializers(this, _productId_initializers, void 0);
            this.name = (__runInitializers(this, _productId_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.price = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _price_initializers, void 0));
            this.currencyCode = (__runInitializers(this, _price_extraInitializers), __runInitializers(this, _currencyCode_initializers, void 0));
            this.availableStock = (__runInitializers(this, _currencyCode_extraInitializers), __runInitializers(this, _availableStock_initializers, void 0));
            this.features = (__runInitializers(this, _availableStock_extraInitializers), __runInitializers(this, _features_initializers, void 0));
            __runInitializers(this, _features_extraInitializers);
        }
        return CreateProductVariationInput_1;
    }());
    __setFunctionName(_classThis, "CreateProductVariationInput");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _productId_decorators = [(0, graphql_1.Field)(function () { return graphql_1.ID; })];
        _name_decorators = [(0, graphql_1.Field)()];
        _price_decorators = [(0, graphql_1.Field)()];
        _currencyCode_decorators = [(0, graphql_1.Field)()];
        _availableStock_decorators = [(0, graphql_1.Field)()];
        _features_decorators = [(0, graphql_1.Field)(function () { return [update_variation_feature_input_1.UpdateVariationFeatureInput]; })];
        __esDecorate(null, null, _productId_decorators, { kind: "field", name: "productId", static: false, private: false, access: { has: function (obj) { return "productId" in obj; }, get: function (obj) { return obj.productId; }, set: function (obj, value) { obj.productId = value; } }, metadata: _metadata }, _productId_initializers, _productId_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _price_decorators, { kind: "field", name: "price", static: false, private: false, access: { has: function (obj) { return "price" in obj; }, get: function (obj) { return obj.price; }, set: function (obj, value) { obj.price = value; } }, metadata: _metadata }, _price_initializers, _price_extraInitializers);
        __esDecorate(null, null, _currencyCode_decorators, { kind: "field", name: "currencyCode", static: false, private: false, access: { has: function (obj) { return "currencyCode" in obj; }, get: function (obj) { return obj.currencyCode; }, set: function (obj, value) { obj.currencyCode = value; } }, metadata: _metadata }, _currencyCode_initializers, _currencyCode_extraInitializers);
        __esDecorate(null, null, _availableStock_decorators, { kind: "field", name: "availableStock", static: false, private: false, access: { has: function (obj) { return "availableStock" in obj; }, get: function (obj) { return obj.availableStock; }, set: function (obj, value) { obj.availableStock = value; } }, metadata: _metadata }, _availableStock_initializers, _availableStock_extraInitializers);
        __esDecorate(null, null, _features_decorators, { kind: "field", name: "features", static: false, private: false, access: { has: function (obj) { return "features" in obj; }, get: function (obj) { return obj.features; }, set: function (obj, value) { obj.features = value; } }, metadata: _metadata }, _features_initializers, _features_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CreateProductVariationInput = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CreateProductVariationInput = _classThis;
}();
exports.CreateProductVariationInput = CreateProductVariationInput;
