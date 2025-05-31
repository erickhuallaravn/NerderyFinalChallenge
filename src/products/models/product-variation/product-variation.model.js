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
exports.ProductVariation = void 0;
var graphql_1 = require("@nestjs/graphql");
var product_model_1 = require("../product/product.model");
var product_file_model_1 = require("../product-file/product-file.model");
var feature_model_1 = require("../feature/feature.model");
var ProductVariation = function () {
    var _classDecorators = [(0, graphql_1.ObjectType)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
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
    var _product_decorators;
    var _product_initializers = [];
    var _product_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    var _updatedAt_decorators;
    var _updatedAt_initializers = [];
    var _updatedAt_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _statusUpdatedAt_decorators;
    var _statusUpdatedAt_initializers = [];
    var _statusUpdatedAt_extraInitializers = [];
    var _productFiles_decorators;
    var _productFiles_initializers = [];
    var _productFiles_extraInitializers = [];
    var _features_decorators;
    var _features_initializers = [];
    var _features_extraInitializers = [];
    var ProductVariation = _classThis = /** @class */ (function () {
        function ProductVariation_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.price = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _price_initializers, void 0));
            this.currencyCode = (__runInitializers(this, _price_extraInitializers), __runInitializers(this, _currencyCode_initializers, void 0));
            this.availableStock = (__runInitializers(this, _currencyCode_extraInitializers), __runInitializers(this, _availableStock_initializers, void 0));
            this.product = (__runInitializers(this, _availableStock_extraInitializers), __runInitializers(this, _product_initializers, void 0));
            this.createdAt = (__runInitializers(this, _product_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.status = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.statusUpdatedAt = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _statusUpdatedAt_initializers, void 0));
            this.productFiles = (__runInitializers(this, _statusUpdatedAt_extraInitializers), __runInitializers(this, _productFiles_initializers, void 0));
            this.features = (__runInitializers(this, _productFiles_extraInitializers), __runInitializers(this, _features_initializers, void 0));
            __runInitializers(this, _features_extraInitializers);
        }
        return ProductVariation_1;
    }());
    __setFunctionName(_classThis, "ProductVariation");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, graphql_1.Field)(function () { return graphql_1.ID; })];
        _name_decorators = [(0, graphql_1.Field)()];
        _price_decorators = [(0, graphql_1.Field)()];
        _currencyCode_decorators = [(0, graphql_1.Field)()];
        _availableStock_decorators = [(0, graphql_1.Field)()];
        _product_decorators = [(0, graphql_1.Field)(function () { return product_model_1.Product; })];
        _createdAt_decorators = [(0, graphql_1.Field)()];
        _updatedAt_decorators = [(0, graphql_1.Field)({ nullable: true })];
        _status_decorators = [(0, graphql_1.Field)()];
        _statusUpdatedAt_decorators = [(0, graphql_1.Field)()];
        _productFiles_decorators = [(0, graphql_1.Field)(function () { return [product_file_model_1.ProductFile]; })];
        _features_decorators = [(0, graphql_1.Field)(function () { return [feature_model_1.Feature]; })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _price_decorators, { kind: "field", name: "price", static: false, private: false, access: { has: function (obj) { return "price" in obj; }, get: function (obj) { return obj.price; }, set: function (obj, value) { obj.price = value; } }, metadata: _metadata }, _price_initializers, _price_extraInitializers);
        __esDecorate(null, null, _currencyCode_decorators, { kind: "field", name: "currencyCode", static: false, private: false, access: { has: function (obj) { return "currencyCode" in obj; }, get: function (obj) { return obj.currencyCode; }, set: function (obj, value) { obj.currencyCode = value; } }, metadata: _metadata }, _currencyCode_initializers, _currencyCode_extraInitializers);
        __esDecorate(null, null, _availableStock_decorators, { kind: "field", name: "availableStock", static: false, private: false, access: { has: function (obj) { return "availableStock" in obj; }, get: function (obj) { return obj.availableStock; }, set: function (obj, value) { obj.availableStock = value; } }, metadata: _metadata }, _availableStock_initializers, _availableStock_extraInitializers);
        __esDecorate(null, null, _product_decorators, { kind: "field", name: "product", static: false, private: false, access: { has: function (obj) { return "product" in obj; }, get: function (obj) { return obj.product; }, set: function (obj, value) { obj.product = value; } }, metadata: _metadata }, _product_initializers, _product_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: function (obj) { return "updatedAt" in obj; }, get: function (obj) { return obj.updatedAt; }, set: function (obj, value) { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _statusUpdatedAt_decorators, { kind: "field", name: "statusUpdatedAt", static: false, private: false, access: { has: function (obj) { return "statusUpdatedAt" in obj; }, get: function (obj) { return obj.statusUpdatedAt; }, set: function (obj, value) { obj.statusUpdatedAt = value; } }, metadata: _metadata }, _statusUpdatedAt_initializers, _statusUpdatedAt_extraInitializers);
        __esDecorate(null, null, _productFiles_decorators, { kind: "field", name: "productFiles", static: false, private: false, access: { has: function (obj) { return "productFiles" in obj; }, get: function (obj) { return obj.productFiles; }, set: function (obj, value) { obj.productFiles = value; } }, metadata: _metadata }, _productFiles_initializers, _productFiles_extraInitializers);
        __esDecorate(null, null, _features_decorators, { kind: "field", name: "features", static: false, private: false, access: { has: function (obj) { return "features" in obj; }, get: function (obj) { return obj.features; }, set: function (obj, value) { obj.features = value; } }, metadata: _metadata }, _features_initializers, _features_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProductVariation = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProductVariation = _classThis;
}();
exports.ProductVariation = ProductVariation;
