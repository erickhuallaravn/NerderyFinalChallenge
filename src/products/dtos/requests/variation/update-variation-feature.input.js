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
exports.UpdateVariationFeatureInput = void 0;
var graphql_1 = require("@nestjs/graphql");
var UpdateVariationFeatureInput = function () {
    var _classDecorators = [(0, graphql_1.InputType)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _optionCode_decorators;
    var _optionCode_initializers = [];
    var _optionCode_extraInitializers = [];
    var _valueCode_decorators;
    var _valueCode_initializers = [];
    var _valueCode_extraInitializers = [];
    var UpdateVariationFeatureInput = _classThis = /** @class */ (function () {
        function UpdateVariationFeatureInput_1() {
            this.optionCode = __runInitializers(this, _optionCode_initializers, void 0);
            this.valueCode = (__runInitializers(this, _optionCode_extraInitializers), __runInitializers(this, _valueCode_initializers, void 0));
            __runInitializers(this, _valueCode_extraInitializers);
        }
        return UpdateVariationFeatureInput_1;
    }());
    __setFunctionName(_classThis, "UpdateVariationFeatureInput");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _optionCode_decorators = [(0, graphql_1.Field)()];
        _valueCode_decorators = [(0, graphql_1.Field)()];
        __esDecorate(null, null, _optionCode_decorators, { kind: "field", name: "optionCode", static: false, private: false, access: { has: function (obj) { return "optionCode" in obj; }, get: function (obj) { return obj.optionCode; }, set: function (obj, value) { obj.optionCode = value; } }, metadata: _metadata }, _optionCode_initializers, _optionCode_extraInitializers);
        __esDecorate(null, null, _valueCode_decorators, { kind: "field", name: "valueCode", static: false, private: false, access: { has: function (obj) { return "valueCode" in obj; }, get: function (obj) { return obj.valueCode; }, set: function (obj, value) { obj.valueCode = value; } }, metadata: _metadata }, _valueCode_initializers, _valueCode_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        UpdateVariationFeatureInput = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return UpdateVariationFeatureInput = _classThis;
}();
exports.UpdateVariationFeatureInput = UpdateVariationFeatureInput;
