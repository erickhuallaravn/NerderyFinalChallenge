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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopCartService = void 0;
var common_1 = require("@nestjs/common");
var ShopCartService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ShopCartService = _classThis = /** @class */ (function () {
        function ShopCartService_1(prisma) {
            this.prisma = prisma;
        }
        ShopCartService_1.prototype.getOrCreateHeader = function (customerId) {
            return __awaiter(this, void 0, void 0, function () {
                var header;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.shopCartHeader.findFirst({
                                where: { customerId: customerId },
                            })];
                        case 1:
                            header = _a.sent();
                            if (!!header) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.prisma.shopCartHeader.create({
                                    data: {
                                        customerId: customerId,
                                        name: 'default',
                                    },
                                })];
                        case 2:
                            header = _a.sent();
                            _a.label = 3;
                        case 3: return [2 /*return*/, header];
                    }
                });
            });
        };
        ShopCartService_1.prototype.getItems = function (customerId) {
            return __awaiter(this, void 0, void 0, function () {
                var header;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getOrCreateHeader(customerId)];
                        case 1:
                            header = _a.sent();
                            return [2 /*return*/, this.prisma.shopCartItem.findMany({
                                    where: { shoppingCartHeaderId: header.id },
                                    include: { shopCartItemDiscounts: true },
                                })];
                    }
                });
            });
        };
        ShopCartService_1.prototype.addOrUpdateItem = function (customerId, input) {
            return __awaiter(this, void 0, void 0, function () {
                var productVariationId, quantity, productInfo, header, existing, promos, _i, promos_1, promo, meetsRequirement, item, _a, promos_2, promo, meetsRequirement;
                var _b, _c, _d, _e, _f, _g;
                return __generator(this, function (_h) {
                    switch (_h.label) {
                        case 0:
                            productVariationId = input.productVariationId, quantity = input.quantity;
                            return [4 /*yield*/, this.prisma.productVariation.findUnique({
                                    where: { id: productVariationId },
                                    select: { name: true, price: true },
                                })];
                        case 1:
                            productInfo = _h.sent();
                            if (!productInfo)
                                throw new common_1.NotFoundException('The product specified does not exist.');
                            return [4 /*yield*/, this.getOrCreateHeader(customerId)];
                        case 2:
                            header = _h.sent();
                            return [4 /*yield*/, this.prisma.shopCartItem.findFirst({
                                    where: {
                                        shoppingCartHeaderId: header.id,
                                        productVariationId: productVariationId,
                                    },
                                })];
                        case 3:
                            existing = _h.sent();
                            return [4 /*yield*/, this.prisma.promotionalDiscount.findMany({
                                    where: {
                                        productVariationId: productVariationId,
                                        validUntil: { gte: new Date() },
                                        status: 'ACTIVE',
                                    },
                                })];
                        case 4:
                            promos = _h.sent();
                            if (!existing) return [3 /*break*/, 12];
                            return [4 /*yield*/, this.prisma.shopCartItem.update({
                                    where: { id: existing.id },
                                    data: {
                                        quantity: quantity,
                                        updatedAt: new Date(),
                                    },
                                })];
                        case 5:
                            _h.sent();
                            _i = 0, promos_1 = promos;
                            _h.label = 6;
                        case 6:
                            if (!(_i < promos_1.length)) return [3 /*break*/, 11];
                            promo = promos_1[_i];
                            meetsRequirement = quantity >= promo.requiredAmount;
                            if (!meetsRequirement) return [3 /*break*/, 8];
                            return [4 /*yield*/, this.prisma.shopCartItemDiscount.upsert({
                                    where: {
                                        shopCartItemId_promotionalDiscountId: {
                                            shopCartItemId: existing.id,
                                            promotionalDiscountId: promo.id,
                                        },
                                    },
                                    create: {
                                        shopCartItemId: existing.id,
                                        promotionalDiscountId: promo.id,
                                        requiredAmount: promo.requiredAmount,
                                        discountPercentage: (_b = promo.discountPercentage) !== null && _b !== void 0 ? _b : undefined,
                                        bonusQuantity: (_c = promo.bonusQuantity) !== null && _c !== void 0 ? _c : undefined,
                                    },
                                    update: {
                                        requiredAmount: promo.requiredAmount,
                                        discountPercentage: (_d = promo.discountPercentage) !== null && _d !== void 0 ? _d : undefined,
                                        bonusQuantity: (_e = promo.bonusQuantity) !== null && _e !== void 0 ? _e : undefined,
                                        updatedAt: new Date(),
                                    },
                                })];
                        case 7:
                            _h.sent();
                            return [3 /*break*/, 10];
                        case 8: return [4 /*yield*/, this.prisma.shopCartItemDiscount.deleteMany({
                                where: {
                                    shopCartItemId: existing.id,
                                    promotionalDiscountId: promo.id,
                                },
                            })];
                        case 9:
                            _h.sent();
                            _h.label = 10;
                        case 10:
                            _i++;
                            return [3 /*break*/, 6];
                        case 11: return [2 /*return*/, true];
                        case 12: return [4 /*yield*/, this.prisma.shopCartItem.create({
                                data: {
                                    shoppingCartHeaderId: header.id,
                                    productVariationId: productVariationId,
                                    productName: productInfo.name,
                                    quantity: quantity,
                                    subtotal: quantity * Number(productInfo.price),
                                },
                            })];
                        case 13:
                            item = _h.sent();
                            _a = 0, promos_2 = promos;
                            _h.label = 14;
                        case 14:
                            if (!(_a < promos_2.length)) return [3 /*break*/, 17];
                            promo = promos_2[_a];
                            meetsRequirement = quantity >= promo.requiredAmount;
                            if (!meetsRequirement) return [3 /*break*/, 16];
                            return [4 /*yield*/, this.prisma.shopCartItemDiscount.create({
                                    data: {
                                        shopCartItemId: item.id,
                                        promotionalDiscountId: promo.id,
                                        requiredAmount: promo.requiredAmount,
                                        discountPercentage: (_f = promo.discountPercentage) !== null && _f !== void 0 ? _f : undefined,
                                        bonusQuantity: (_g = promo.bonusQuantity) !== null && _g !== void 0 ? _g : undefined,
                                    },
                                })];
                        case 15:
                            _h.sent();
                            _h.label = 16;
                        case 16:
                            _a++;
                            return [3 /*break*/, 14];
                        case 17: return [2 /*return*/, true];
                    }
                });
            });
        };
        ShopCartService_1.prototype.emptyCart = function (customerId) {
            return __awaiter(this, void 0, void 0, function () {
                var header;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getOrCreateHeader(customerId)];
                        case 1:
                            header = _a.sent();
                            return [4 /*yield*/, this.prisma.shopCartItem.deleteMany({
                                    where: { shoppingCartHeaderId: header.id },
                                })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        return ShopCartService_1;
    }());
    __setFunctionName(_classThis, "ShopCartService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ShopCartService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ShopCartService = _classThis;
}();
exports.ShopCartService = ShopCartService;
