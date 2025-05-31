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
exports.ProductFile = void 0;
var graphql_1 = require("@nestjs/graphql");
var product_variation_model_1 = require("../product-variation/product-variation.model");
var ProductFile = function () {
    var _classDecorators = [(0, graphql_1.ObjectType)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _productVariationId_decorators;
    var _productVariationId_initializers = [];
    var _productVariationId_extraInitializers = [];
    var _fileExtension_decorators;
    var _fileExtension_initializers = [];
    var _fileExtension_extraInitializers = [];
    var _url_decorators;
    var _url_initializers = [];
    var _url_extraInitializers = [];
    var _altText_decorators;
    var _altText_initializers = [];
    var _altText_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    var _updatedAt_decorators;
    var _updatedAt_initializers = [];
    var _updatedAt_extraInitializers = [];
    var _productVariation_decorators;
    var _productVariation_initializers = [];
    var _productVariation_extraInitializers = [];
    var ProductFile = _classThis = /** @class */ (function () {
        function ProductFile_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.productVariationId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _productVariationId_initializers, void 0));
            this.fileExtension = (__runInitializers(this, _productVariationId_extraInitializers), __runInitializers(this, _fileExtension_initializers, void 0));
            this.url = (__runInitializers(this, _fileExtension_extraInitializers), __runInitializers(this, _url_initializers, void 0));
            this.altText = (__runInitializers(this, _url_extraInitializers), __runInitializers(this, _altText_initializers, void 0));
            this.createdAt = (__runInitializers(this, _altText_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.productVariation = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _productVariation_initializers, void 0));
            __runInitializers(this, _productVariation_extraInitializers);
        }
        return ProductFile_1;
    }());
    __setFunctionName(_classThis, "ProductFile");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, graphql_1.Field)(function () { return graphql_1.ID; })];
        _productVariationId_decorators = [(0, graphql_1.Field)()];
        _fileExtension_decorators = [(0, graphql_1.Field)()];
        _url_decorators = [(0, graphql_1.Field)()];
        _altText_decorators = [(0, graphql_1.Field)()];
        _createdAt_decorators = [(0, graphql_1.Field)()];
        _updatedAt_decorators = [(0, graphql_1.Field)()];
        _productVariation_decorators = [(0, graphql_1.Field)(function () { return product_variation_model_1.ProductVariation; })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _productVariationId_decorators, { kind: "field", name: "productVariationId", static: false, private: false, access: { has: function (obj) { return "productVariationId" in obj; }, get: function (obj) { return obj.productVariationId; }, set: function (obj, value) { obj.productVariationId = value; } }, metadata: _metadata }, _productVariationId_initializers, _productVariationId_extraInitializers);
        __esDecorate(null, null, _fileExtension_decorators, { kind: "field", name: "fileExtension", static: false, private: false, access: { has: function (obj) { return "fileExtension" in obj; }, get: function (obj) { return obj.fileExtension; }, set: function (obj, value) { obj.fileExtension = value; } }, metadata: _metadata }, _fileExtension_initializers, _fileExtension_extraInitializers);
        __esDecorate(null, null, _url_decorators, { kind: "field", name: "url", static: false, private: false, access: { has: function (obj) { return "url" in obj; }, get: function (obj) { return obj.url; }, set: function (obj, value) { obj.url = value; } }, metadata: _metadata }, _url_initializers, _url_extraInitializers);
        __esDecorate(null, null, _altText_decorators, { kind: "field", name: "altText", static: false, private: false, access: { has: function (obj) { return "altText" in obj; }, get: function (obj) { return obj.altText; }, set: function (obj, value) { obj.altText = value; } }, metadata: _metadata }, _altText_initializers, _altText_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: function (obj) { return "updatedAt" in obj; }, get: function (obj) { return obj.updatedAt; }, set: function (obj, value) { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _productVariation_decorators, { kind: "field", name: "productVariation", static: false, private: false, access: { has: function (obj) { return "productVariation" in obj; }, get: function (obj) { return obj.productVariation; }, set: function (obj, value) { obj.productVariation = value; } }, metadata: _metadata }, _productVariation_initializers, _productVariation_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProductFile = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProductFile = _classThis;
}();
exports.ProductFile = ProductFile;
