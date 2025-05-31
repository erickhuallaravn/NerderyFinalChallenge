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
exports.CreateOrderHeaderStatusInput = void 0;
var graphql_1 = require("@nestjs/graphql");
var class_validator_1 = require("class-validator");
var CreateOrderHeaderStatusInput = function () {
    var _classDecorators = [(0, graphql_1.InputType)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _orderHeaderId_decorators;
    var _orderHeaderId_initializers = [];
    var _orderHeaderId_extraInitializers = [];
    var _orderStatusId_decorators;
    var _orderStatusId_initializers = [];
    var _orderStatusId_extraInitializers = [];
    var _notes_decorators;
    var _notes_initializers = [];
    var _notes_extraInitializers = [];
    var CreateOrderHeaderStatusInput = _classThis = /** @class */ (function () {
        function CreateOrderHeaderStatusInput_1() {
            this.orderHeaderId = __runInitializers(this, _orderHeaderId_initializers, void 0);
            this.orderStatusId = (__runInitializers(this, _orderHeaderId_extraInitializers), __runInitializers(this, _orderStatusId_initializers, void 0));
            this.notes = (__runInitializers(this, _orderStatusId_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            __runInitializers(this, _notes_extraInitializers);
        }
        return CreateOrderHeaderStatusInput_1;
    }());
    __setFunctionName(_classThis, "CreateOrderHeaderStatusInput");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _orderHeaderId_decorators = [(0, graphql_1.Field)(), (0, class_validator_1.IsUUID)()];
        _orderStatusId_decorators = [(0, graphql_1.Field)(), (0, class_validator_1.IsUUID)()];
        _notes_decorators = [(0, graphql_1.Field)({ nullable: true }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
        __esDecorate(null, null, _orderHeaderId_decorators, { kind: "field", name: "orderHeaderId", static: false, private: false, access: { has: function (obj) { return "orderHeaderId" in obj; }, get: function (obj) { return obj.orderHeaderId; }, set: function (obj, value) { obj.orderHeaderId = value; } }, metadata: _metadata }, _orderHeaderId_initializers, _orderHeaderId_extraInitializers);
        __esDecorate(null, null, _orderStatusId_decorators, { kind: "field", name: "orderStatusId", static: false, private: false, access: { has: function (obj) { return "orderStatusId" in obj; }, get: function (obj) { return obj.orderStatusId; }, set: function (obj, value) { obj.orderStatusId = value; } }, metadata: _metadata }, _orderStatusId_initializers, _orderStatusId_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: function (obj) { return "notes" in obj; }, get: function (obj) { return obj.notes; }, set: function (obj, value) { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CreateOrderHeaderStatusInput = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CreateOrderHeaderStatusInput = _classThis;
}();
exports.CreateOrderHeaderStatusInput = CreateOrderHeaderStatusInput;
