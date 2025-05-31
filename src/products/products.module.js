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
exports.ProductModule = void 0;
var common_1 = require("@nestjs/common");
var product_service_1 = require("./services/product/product.service");
var product_variation_service_1 = require("./services/product-variation/product-variation.service");
var product_resolver_1 = require("./resolvers/product/product.resolver");
var product_variation_resolver_1 = require("./resolvers/product-variation/product-variation.resolver");
var prisma_module_1 = require("../prisma/prisma.module");
var product_file_service_1 = require("./services/product-file/product-file.service");
var product_file_resolver_1 = require("./resolvers/product-file/product-file.resolver");
var cloudinary_module_1 = require("../../../../../../../../../src/cloudinary/cloudinary.module");
var feature_resolver_1 = require("./resolvers/feature/feature.resolver");
var feature_service_1 = require("./services/feature/feature.service");
var option_service_1 = require("./services/option/option.service");
var option_value_service_1 = require("./services/option/option-value.service");
var ProductModule = function () {
    var _classDecorators = [(0, common_1.Module)({
            imports: [prisma_module_1.PrismaModule, cloudinary_module_1.CloudinaryModule],
            providers: [
                product_service_1.ProductService,
                product_resolver_1.ProductResolver,
                product_variation_service_1.ProductVariationService,
                product_variation_resolver_1.ProductVariationResolver,
                product_file_service_1.ProductFileService,
                product_file_resolver_1.ProductFileResolver,
                feature_resolver_1.FeatureResolver,
                feature_service_1.FeatureService,
                option_service_1.OptionService,
                option_value_service_1.OptionValueService,
            ],
            exports: [cloudinary_module_1.CloudinaryModule],
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ProductModule = _classThis = /** @class */ (function () {
        function ProductModule_1() {
        }
        return ProductModule_1;
    }());
    __setFunctionName(_classThis, "ProductModule");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProductModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProductModule = _classThis;
}();
exports.ProductModule = ProductModule;
