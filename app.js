'use strict';

/* ══════════════════════════════════════════════
   موسوعة أكلات العالم — app.js v5.0
   صور حقيقية من Unsplash لكل وجبة
   ══════════════════════════════════════════════ */

const S = {
  countries: [], filtered: [], page: 0, pageSize: 24, view: 'grid'
};

const $ = id => document.getElementById(id);

const EL = {
  preloader:    $('preloader'),
  navbar:       $('navbar'),
  searchInput:  $('searchInput'),
  searchClear:  $('searchClear'),
  regionFilter: $('regionFilter'),
  sortSelect:   $('sortSelect'),
  grid:         $('countriesGrid'),
  resultsText:  $('resultsText'),
  cCount:       $('navC'),
  rCount:       $('navR'),
  navC:         $('navC'),
  navR:         $('navR'),
  randomBtn:    $('randomBtn'),
  themeBtn:     $('themeBtn'),
  themeIco:     $('themeIco'),
  gridBtn:      $('gridBtn'),
  listBtn:      $('listBtn'),
  lmWrap:       $('loadMoreWrapper'),
  lmBtn:        $('loadMoreBtn'),
  regionList:   $('regionList'),
  popularList:  $('popularList'),
  modal:        $('modal'),
  modalBd:      $('modalBd'),
  modalContent: $('modalContent'),
  modalClose:   $('modalClose'),
  particles:    $('particles'),
  toast:        $('toast'),
  tpl:          $('tpl')
};

/* ══════════════════════════════════════════════
   📸 REAL FOOD PHOTOS DATABASE
   صور حقيقية من Unsplash لكل وجبة
   ══════════════════════════════════════════════ */

// قاعدة بيانات الصور الحقيقية - مرتبة حسب اسم الوجبة الإنجليزي
// Unsplash CDN - صور عالية الجودة
const FOOD_IMAGES = {
  // === أ ===
  "Acarajé":                "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&q=80",
  "Alexandrian Liver":      "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80",
  "Apple Pastry":           "https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?w=600&q=80",
  "Arancini":               "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=600&q=80",
  "Aromatic Fried Rice":    "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&q=80",
  "Arroz con Pollo":        "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&q=80",
  "Artisan Sandwich":       "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
  "Avocado Salad":          "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",

  // === ب ===
  "BBQ Plate":              "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80",
  "BBQ Ribs":               "https://images.unsplash.com/photo-1558030006-450675393462?w=600&q=80",
  "Baked Fish":             "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&q=80",
  "Baked Mince":            "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=600&q=80",
  "Baked Pasta":            "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&q=80",
  "Baked Pastries":         "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80",
  "Baked Spiced Fish":      "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&q=80",
  "Baked Stuffed Vegetables":"https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
  "Baklava":                "https://images.unsplash.com/photo-1619881590738-a111f0e1a7e5?w=600&q=80",
  "Bamia Stew":             "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80",
  "Bao Buns":               "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&q=80",
  "Barbecue Plate":         "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=600&q=80",
  "Bean Dessert":           "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&q=80",
  "Bean Dish":              "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&q=80",
  "Bean Fritters":          "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=600&q=80",
  "Bean Pudding":           "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&q=80",
  "Bean Soup":              "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80",
  "Bean Stew":              "https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=600&q=80",
  "Beet Burger":            "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80",
  "Biryani":                "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80",
  "Black Bean Stew":        "https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=600&q=80",
  "Bolognese":              "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=600&q=80",
  "Braai":                  "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=600&q=80",
  "Breakfast Beans":        "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&q=80",
  "Breakfast Plate":        "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=600&q=80",
  "Brigadeiro":             "https://images.unsplash.com/photo-1548365328-8c6db3220e4c?w=600&q=80",
  "Burger":                 "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80",
  "Burger/Sandwich":        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80",
  "Burrito":                "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=600&q=80",
  "Butter Chicken":         "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600&q=80",

  // === ك ===
  "Carbonara":              "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=600&q=80",
  "Chakalaka":              "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&q=80",
  "Charcoal Skewers":       "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=600&q=80",
  "Cheese Bread":           "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80",
  "Cheesecake":             "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&q=80",
  "Cheesy Pasta":           "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&q=80",
  "Chicken Curry":          "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&q=80",
  "Chicken Rice":           "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&q=80",
  "Chickpea Soup":          "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80",
  "Chole":                  "https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=600&q=80",
  "Chorizo with Potatoes":  "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=600&q=80",
  "Chow Mein":              "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80",
  "Cinnamon Bun":           "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80",
  "Clam Chowder":           "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80",
  "Classic Stew":           "https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=600&q=80",
  "Clear Broth Soup":       "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80",
  "Coconut Curry":          "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&q=80",
  "Coconut Dessert":        "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&q=80",
  "Coconut Fish":           "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&q=80",
  "Coconut Pudding":        "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&q=80",
  "Coconut Rice":           "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&q=80",
  "Coconut Soup":           "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80",
  "Coleslaw":               "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
  "Cooked Greens":          "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
  "Corn or Chicken Soup":   "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80",
  "Corn/Pumpkin Soup":      "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80",
  "Couscous with Vegetables":"https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=600&q=80",
  "Coxinha":                "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&q=80",
  "Cream Soup":             "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80",
  "Creamy Soup":            "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80",
  "Crepe Style Pancake":    "https://images.unsplash.com/photo-1519676867240-f03562e64548?w=600&q=80",
  "Crispy Chicken":         "https://images.unsplash.com/photo-1562967914-608f82629710?w=600&q=80",
  "Cumin Grilled Meat":     "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=600&q=80",
  "Cured Meat Plate":       "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80",

  // === د ===
  "Dal":                    "https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=600&q=80",
  "Damper Bread":           "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80",
  "Dessert Pie":            "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&q=80",
  "Donburi":                "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80",
  "Dumplings":              "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&q=80",

  // === إ ===
  "Earth Oven Roast":       "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=600&q=80",
  "Eggplant Bake":          "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
  "Egyptian Shawarma":      "https://images.unsplash.com/photo-1604908177453-7462950a6a3b?w=600&q=80",
  "Empanada":               "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&q=80",
  "Enchiladas":             "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80",

  // === ف ===
  "Farofa":                 "https://images.unsplash.com/photo-1543826173-1beeb97525d8?w=600&q=80",
  "Fatta":                  "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&q=80",
  "Feijoada":               "https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=600&q=80",
  "Fermented Flatbread":    "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80",
  "Festive Rice":           "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80",
  "Filled Dumplings":       "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&q=80",
  "Fish Plate":             "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&q=80",
  "Fish Salad":             "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
  "Fish and Chips":         "https://images.unsplash.com/photo-1574484284002-952d92456975?w=600&q=80",
  "Flatbread":              "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80",
  "Flatbread Breakfast":    "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=600&q=80",
  "Flavored Rice":          "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&q=80",
  "Focaccia":               "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80",
  "Fresh Island Salad":     "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
  "Fresh Rolls":            "https://images.unsplash.com/photo-1562802378-063ec186a863?w=600&q=80",
  "Fresh Salad":            "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
  "Fresh Slaw":             "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=600&q=80",
  "Fried Chicken":          "https://images.unsplash.com/photo-1562967914-608f82629710?w=600&q=80",
  "Fried Dough":            "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&q=80",
  "Fried Plantain":         "https://images.unsplash.com/photo-1543826173-1beeb97525d8?w=600&q=80",
  "Fried Rice":             "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&q=80",
  "Fried Root/Plantain":    "https://images.unsplash.com/photo-1543826173-1beeb97525d8?w=600&q=80",
  "Fruit Tart":             "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&q=80",
  "Fufu":                   "https://images.unsplash.com/photo-1543826173-1beeb97525d8?w=600&q=80",
  "Ful Medames":            "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&q=80",

  // === ج ===
  "Grilled Fish":           "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&q=80",
  "Grilled Meat":           "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=600&q=80",
  "Grilled Seafood":        "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&q=80",
  "Grilled Skewers":        "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=600&q=80",
  "Guacamole":              "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=600&q=80",
  "Gulab Jamun":            "https://images.unsplash.com/photo-1548365328-8c6db3220e4c?w=600&q=80",
  "Gyoza":                  "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&q=80",

  // === ح ===
  "Hearty Grain Bowl":      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
  "Herb Chicken":           "https://images.unsplash.com/photo-1598103442097-8b74394b95c3?w=600&q=80",
  "Herb Roast Chicken":     "https://images.unsplash.com/photo-1598103442097-8b74394b95c3?w=600&q=80",
  "Herb Vegetable Stew":    "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80",
  "Home Fried Rice":        "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&q=80",
  "Home Kebab":             "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=600&q=80",
  "Hot Dog":                "https://images.unsplash.com/photo-1612392061787-2a3e9c8b3d43?w=600&q=80",
  "Hot Pot":                "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80",

  // === ع ===
  "Iraqi Dolma":            "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&q=80",
  "Iskender Kebab":         "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=600&q=80",
  "Island Bread":           "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80",
  "Island Flatbread":       "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80",
  "Island Grilled Fish":    "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&q=80",
  "Island Patties":         "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80",
  "Island Salad":           "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
  "Island Soup":            "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80",

  // === ي ===
  "Jambalaya":              "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&q=80",
  "Japanese Curry":         "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80",
  "Jerk Style Chicken":     "https://images.unsplash.com/photo-1562967914-608f82629710?w=600&q=80",
  "Jollof Style Rice":      "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&q=80",

  // === ك ===
  "Kibbeh":                 "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=600&q=80",
  "Koshari":                "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&q=80",
  "Kung Pao Chicken":       "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=600&q=80",

  // === ل ===
  "Lahmacun":               "https://images.unsplash.com/photo-1528137871618-79d2761e3fd5?w=600&q=80",
  "Lamington":              "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&q=80",
  "Lasagna":                "https://images.unsplash.com/photo-1619895092538-128341789043?w=600&q=80",
  "Leaf Coconut Dish":      "https://images.unsplash.com/photo-1543826173-1beeb97525d8?w=600&q=80",
  "Lemongrass Fish":        "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&q=80",
  "Lentil Vegetable Stew":  "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80",
  "Local Curry":            "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&q=80",

  // === م ===
  "Mac and Cheese":         "https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?w=600&q=80",
  "Mahshi":                 "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&q=80",
  "Maize Porridge":         "https://images.unsplash.com/photo-1543826173-1beeb97525d8?w=600&q=80",
  "Manti":                  "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&q=80",
  "Mapo Tofu":              "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=600&q=80",
  "Masala Dosa":            "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&q=80",
  "Masgouf":                "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&q=80",
  "Mashed Potatoes":        "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&q=80",
  "Mashed Root Dish":       "https://images.unsplash.com/photo-1543826173-1beeb97525d8?w=600&q=80",
  "Meat Pie":               "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=600&q=80",
  "Meat Tagine":            "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=600&q=80",
  "Meatballs":              "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=600&q=80",
  "Mediterranean Fish":     "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&q=80",
  "Mediterranean Salad":    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
  "Menemen":                "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=600&q=80",
  "Mercimek Soup":          "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80",
  "Milk Dessert":           "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&q=80",
  "Milk Tart Style":        "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&q=80",
  "Minestrone":             "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80",
  "Mochi":                  "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&q=80",
  "Mole":                   "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80",
  "Molokhia":               "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80",
  "Moqueca":                "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&q=80",

  // === ن ===
  "Naan":                   "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&q=80",
  "Neapolitan Pizza":       "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80",
  "Noodle Soup":            "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80",

  // === أو ===
  "Oat Porridge":           "https://images.unsplash.com/photo-1495214783159-3503fd1b572d?w=600&q=80",
  "Om Ali":                 "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&q=80",
  "Onigiri":                "https://images.unsplash.com/photo-1562802378-063ec186a863?w=600&q=80",
  "Open Sandwich":          "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
  "Osso Buco":              "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80",

  // === ب ===
  "Pacha":                  "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80",
  "Palak Paneer":           "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&q=80",
  "Pan Cakes":              "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&q=80",
  "Pancakes":               "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&q=80",
  "Pap":                    "https://images.unsplash.com/photo-1543826173-1beeb97525d8?w=600&q=80",
  "Paprika Stew":           "https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=600&q=80",
  "Pasta or Rice Plate":    "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&q=80",
  "Pastry Dessert":         "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80",
  "Pavlova":                "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&q=80",
  "Peking Duck":            "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=600&q=80",
  "Pepper Soup":            "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80",
  "Picanha":                "https://images.unsplash.com/photo-1558030006-450675393462?w=600&q=80",
  "Pide":                   "https://images.unsplash.com/photo-1528137871618-79d2761e3fd5?w=600&q=80",
  "Pilaf":                  "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80",
  "Pilau Rice":             "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80",
  "Plantain/Yam Plate":     "https://images.unsplash.com/photo-1543826173-1beeb97525d8?w=600&q=80",
  "Potato Bake":            "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&q=80",
  "Potato Gratin":          "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&q=80",
  "Potato Salad":           "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
  "Pozole":                 "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80",
  "Puff Dough":             "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80",
  "Pumpkin Soup":           "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80",
  "Pão de Queijo":          "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80",

  // === ك ===
  "Quesadilla":             "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80",
  "Quzi":                   "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80",

  // === ر ===
  "Ramen":                  "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80",
  "Rice Bowl":              "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80",
  "Rice Plate":             "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&q=80",
  "Rice Pudding":           "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&q=80",
  "Rice and Beans":         "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&q=80",
  "Rice with Chicken":      "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&q=80",
  "Risotto":                "https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=600&q=80",
  "Roast Chicken":          "https://images.unsplash.com/photo-1598103442097-8b74394b95c3?w=600&q=80",
  "Roasted Potatoes":       "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&q=80",
  "Root Stew":              "https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=600&q=80",
  "Root Vegetable Plate":   "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
  "Root Vegetable Soup":    "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80",

  // === س ===
  "Samosa":                 "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&q=80",
  "Samosa Pastry":          "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&q=80",
  "Sarma":                  "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&q=80",
  "Satay Skewers":          "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=600&q=80",
  "Sausage Grill":          "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=600&q=80",
  "Sauteed Meat":           "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80",
  "Savory Breakfast":       "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=600&q=80",
  "Savory Pastry":          "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80",
  "Savory Pie":             "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=600&q=80",
  "Savory Tart":            "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&q=80",
  "Seafood Coconut Stew":   "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&q=80",
  "Seafood Stew":           "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&q=80",
  "Seasoned Chicken":       "https://images.unsplash.com/photo-1598103442097-8b74394b95c3?w=600&q=80",
  "Seed Soup":              "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80",
  "Semolina Bowl":          "https://images.unsplash.com/photo-1543826173-1beeb97525d8?w=600&q=80",
  "Simple Fried Rice":      "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&q=80",
  "Skewered Meat":          "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=600&q=80",
  "Sloppy Joe":             "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80",
  "Slow Braised Meat":      "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80",
  "Smoked Fish Plate":      "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&q=80",
  "Soup":                   "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80",
  "Spiced Dal":             "https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=600&q=80",
  "Spiced Lentils":         "https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=600&q=80",
  "Spiced Rice":            "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80",
  "Spiced Rice Platter":    "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80",
  "Spicy Chicken Stew":     "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&q=80",
  "Spicy Salad":            "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
  "Staple with Sauce":      "https://images.unsplash.com/photo-1543826173-1beeb97525d8?w=600&q=80",
  "Steamed Fish":           "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&q=80",
  "Sticky Rice Dessert":    "https://images.unsplash.com/photo-1562802378-063ec186a863?w=600&q=80",
  "Stir Fried Greens":      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
  "Stir Fried Noodles":     "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80",
  "Strogonoff":             "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80",
  "Stuffed Cabbage":        "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&q=80",
  "Stuffed Dumplings":      "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&q=80",
  "Stuffed Flatbread":      "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&q=80",
  "Stuffed Pigeon":         "https://images.unsplash.com/photo-1598103442097-8b74394b95c3?w=600&q=80",
  "Stuffed Vegetables":     "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&q=80",
  "Sushi":                  "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=600&q=80",
  "Suya Style Skewers":     "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=600&q=80",
  "Sweet Island Bread":     "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80",
  "Sweet Savory Chicken":   "https://images.unsplash.com/photo-1598103442097-8b74394b95c3?w=600&q=80",
  "Sweet Treat":            "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&q=80",
  "Sweet and Sour":         "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=600&q=80",

  // === ت ===
  "Taameya":                "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&q=80",
  "Tacos":                  "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&q=80",
  "Tamal Style":            "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80",
  "Tamales":                "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80",
  "Taman wa Qeema":         "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80",
  "Tandoori Style":         "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&q=80",
  "Tashreeb":               "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80",
  "Tea Breakfast":          "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=600&q=80",
  "Tempura":                "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=600&q=80",
  "Tepsi Baytinijan":       "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
  "Tikka Masala":           "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&q=80",
  "Tiramisu":               "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&q=80",
  "Tofu in Sauce":          "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
  "Tomato Lentil Soup":     "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80",
  "Tomato Rice":            "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&q=80",
  "Tortilla Bean Plate":    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80",
  "Traditional Breakfast Plate":"https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=600&q=80",
  "Tropical Dessert":       "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&q=80",
  "Tropical Fruit Bowl":    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
  "Tropical Salad":         "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
  "Tropical Soup":          "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80",
  "Turkish Kofta":          "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=600&q=80",

  // === أو ===
  "Udon":                   "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80",

  // === خ ===
  "Vegetable Curry":        "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&q=80",
  "Vegetable Omelette":     "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=600&q=80",

  // === و ===
  "Warm Salad":             "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
  "Wok Noodles":            "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80",
  "Wonton Soup":            "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80",

  // === ي ===
  "Yakitori":               "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=600&q=80",
  "Yam/Taro Dish":          "https://images.unsplash.com/photo-1543826173-1beeb97525d8?w=600&q=80",
  "Yogurt Meat Stew":       "https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=600&q=80",
};

// صور خلفية الدول حسب المنطقة الجغرافية (للبطاقات)
const COUNTRY_BG_IMAGES = {
  // الشرق الأوسط وشمال أفريقيا
  "SA": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80",
  "EG": "https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=600&q=80",
  "TR": "https://images.unsplash.com/photo-1549637642-90187f64f420?w=600&q=80",
  "MA": "https://images.unsplash.com/photo-1539020140153-e478baae3e7b?w=600&q=80",
  "IQ": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80",
  "LB": "https://images.unsplash.com/photo-1604908177453-7462950a6a3b?w=600&q=80",
  "SY": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80",
  "JO": "https://images.unsplash.com/photo-1604908177453-7462950a6a3b?w=600&q=80",
  "TN": "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=600&q=80",
  "DZ": "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=600&q=80",
  "LY": "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=600&q=80",
  // آسيا
  "JP": "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=600&q=80",
  "CN": "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=600&q=80",
  "IN": "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80",
  "TH": "https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=600&q=80",
  "KR": "https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=600&q=80",
  "VN": "https://images.unsplash.com/photo-1562802378-063ec186a863?w=600&q=80",
  "ID": "https://images.unsplash.com/photo-1562802378-063ec186a863?w=600&q=80",
  // أوروبا
  "IT": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80",
  "FR": "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80",
  "ES": "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=600&q=80",
  "GR": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
  "DE": "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=600&q=80",
  // أمريكا
  "US": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80",
  "MX": "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&q=80",
  "BR": "https://images.unsplash.com/photo-1558030006-450675393462?w=600&q=80",
  // أفريقيا
  "NG": "https://images.unsplash.com/photo-1543826173-1beeb97525d8?w=600&q=80",
  "ET": "https://images.unsplash.com/photo-1543826173-1beeb97525d8?w=600&q=80",
  "ZA": "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=600&q=80",
};

// صور خلفيات حسب المنطقة
const REGION_FALLBACK_IMAGES = {
  "Asia":          "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80",
  "Europe":        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80",
  "Africa":        "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=600&q=80",
  "Americas":      "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&q=80",
  "Oceania":       "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
  "North America": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80",
  "South America": "https://images.unsplash.com/photo-1558030006-450675393462?w=600&q=80",
};

// صور متنوعة لأنواع الطعام المختلفة (fallback)
const FOOD_CATEGORY_FALLBACK = [
  "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&q=80",  // curry
  "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80",    // soup
  "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=600&q=80", // grilled
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80", // salad
  "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&q=80", // rice
  "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80", // pizza
  "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=600&q=80", // sushi
  "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&q=80", // dessert
  "https://images.unsplash.com/photo-1598103442097-8b74394b95c3?w=600&q=80", // chicken
  "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80", // bread
  "https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=600&q=80", // stew
  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80", // burger
  "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&q=80", // pasta
  "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&q=80", // fish
  "https://images.unsplash.com/photo-1543826173-1beeb97525d8?w=600&q=80",    // african
  "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=600&q=80", // tagine
];

/**
 * الحصول على صورة حقيقية للوجبة
 */
function getFoodImage(recipe, countryCode) {
  const titleEn = recipe.title_en || '';

  // 1. البحث المباشر في قاعدة البيانات
  if (FOOD_IMAGES[titleEn]) {
    return FOOD_IMAGES[titleEn];
  }

  // 2. البحث الجزئي
  const lowerTitle = titleEn.toLowerCase();
  for (const [key, url] of Object.entries(FOOD_IMAGES)) {
    if (lowerTitle.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerTitle)) {
      return url;
    }
  }

  // 3. كلمات مفتاحية في اسم الوجبة
  if (lowerTitle.includes('rice') || lowerTitle.includes('biryani') || lowerTitle.includes('pilaf'))
    return "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80";
  if (lowerTitle.includes('soup') || lowerTitle.includes('stew') || lowerTitle.includes('broth'))
    return "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80";
  if (lowerTitle.includes('chicken') || lowerTitle.includes('poultry'))
    return "https://images.unsplash.com/photo-1598103442097-8b74394b95c3?w=600&q=80";
  if (lowerTitle.includes('fish') || lowerTitle.includes('seafood') || lowerTitle.includes('salmon'))
    return "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&q=80";
  if (lowerTitle.includes('pizza'))
    return "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80";
  if (lowerTitle.includes('pasta') || lowerTitle.includes('noodle') || lowerTitle.includes('spaghetti'))
    return "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&q=80";
  if (lowerTitle.includes('sushi') || lowerTitle.includes('japanese'))
    return "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=600&q=80";
  if (lowerTitle.includes('salad'))
    return "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80";
  if (lowerTitle.includes('bread') || lowerTitle.includes('flatbread') || lowerTitle.includes('naan'))
    return "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80";
  if (lowerTitle.includes('grill') || lowerTitle.includes('bbq') || lowerTitle.includes('kebab') || lowerTitle.includes('skewer'))
    return "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=600&q=80";
  if (lowerTitle.includes('curry') || lowerTitle.includes('masala') || lowerTitle.includes('tikka'))
    return "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&q=80";
  if (lowerTitle.includes('dessert') || lowerTitle.includes('cake') || lowerTitle.includes('sweet') || lowerTitle.includes('pudding'))
    return "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&q=80";
  if (lowerTitle.includes('taco') || lowerTitle.includes('burrito') || lowerTitle.includes('enchilada') || lowerTitle.includes('mexican'))
    return "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&q=80";
  if (lowerTitle.includes('dumpling') || lowerTitle.includes('gyoza') || lowerTitle.includes('wonton'))
    return "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&q=80";
  if (lowerTitle.includes('burger') || lowerTitle.includes('sandwich'))
    return "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80";
  if (lowerTitle.includes('breakfast'))
    return "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=600&q=80";
  if (lowerTitle.includes('ramen') || lowerTitle.includes('udon') || lowerTitle.includes('pho'))
    return "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80";
  if (lowerTitle.includes('meat') || lowerTitle.includes('beef') || lowerTitle.includes('lamb') || lowerTitle.includes('roast'))
    return "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80";
  if (lowerTitle.includes('tagine') || lowerTitle.includes('couscous') || lowerTitle.includes('moroccan'))
    return "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=600&q=80";
  if (lowerTitle.includes('dal') || lowerTitle.includes('lentil') || lowerTitle.includes('dhal'))
    return "https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=600&q=80";

  // 4. Fallback عشوائي حسب كود الدولة
  const seed = countryCode.charCodeAt(0) + countryCode.charCodeAt(1);
  return FOOD_CATEGORY_FALLBACK[seed % FOOD_CATEGORY_FALLBACK.length];
}

/**
 * الحصول على صورة خلفية لبطاقة الدولة
 */
function getCountryBgImage(countryCode, region, recipes) {
  // صورة خاصة بالدولة
  if (COUNTRY_BG_IMAGES[countryCode]) {
    return COUNTRY_BG_IMAGES[countryCode];
  }
  // أول وصفة لها صورة حقيقية
  if (recipes && recipes.length > 0) {
    const img = getFoodImage(recipes[0], countryCode);
    if (img) return img;
  }
  // fallback حسب المنطقة
  return REGION_FALLBACK_IMAGES[region] ||
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80";
}

/**
 * تحميل الصور مع lazy loading وتأثير تحميل ناعم
 */
function loadImageLazy(img) {
  img.classList.add('img-loading');
  const src = img.src || img.dataset.src;
  if (img.dataset.src) {
    img.src = img.dataset.src;
  }
  img.addEventListener('load', () => {
    img.classList.remove('img-loading');
    img.classList.add('img-loaded');
  });
  img.addEventListener('error', () => {
    img.classList.remove('img-loading');
    img.src = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80';
  });
}

/* ══════════════════════════════════════════════
   Theme
   ══════════════════════════════════════════════ */
function setTheme(light) {
  document.body.classList.toggle('light', light);
  EL.themeIco.textContent = light ? '☀️' : '🌙';
  localStorage.setItem('wfTheme', light ? 'light' : 'dark');
}
function loadTheme() { setTheme(localStorage.getItem('wfTheme') === 'light'); }

/* ══════════════════════════════════════════════
   Toast
   ══════════════════════════════════════════════ */
let _tTimer;
function toast(msg, ms = 2800) {
  clearTimeout(_tTimer);
  EL.toast.textContent = msg;
  EL.toast.classList.remove('hidden');
  _tTimer = setTimeout(() => EL.toast.classList.add('hidden'), ms);
}

/* ══════════════════════════════════════════════
   Particles
   ══════════════════════════════════════════════ */
function spawnParticles() {
  for (let i = 0; i < 12; i++) {
    const p = document.createElement('div');
    p.className = 'ptcl';
    const sz = Math.random() * 80 + 24;
    const colors = [
      'rgba(212,100,50,.07)', 'rgba(230,160,30,.06)',
      'rgba(180,60,30,.05)', 'rgba(200,140,40,.06)'
    ];
    p.style.cssText = `
      width:${sz}px; height:${sz}px;
      left:${Math.random()*100}%;
      top:${Math.random()*100}%;
      background: radial-gradient(circle, ${colors[i%4]}, transparent 70%);
      --dur:${Math.random()*20+14}s;
      --dly:${Math.random()*-20}s;`;
    EL.particles.appendChild(p);
  }
}

/* ══════════════════════════════════════════════
   Counter animation
   ══════════════════════════════════════════════ */
function animCount(el, target, dur = 1500) {
  const start = performance.now();
  (function frame(now) {
    const t = Math.min((now - start) / dur, 1);
    const v = Math.round(target * (1 - Math.pow(1 - t, 3)));
    el.textContent = v.toLocaleString('ar-EG');
    if (t < 1) requestAnimationFrame(frame);
  })(start);
}

/* ══════════════════════════════════════════════
   Build Sidebar
   ══════════════════════════════════════════════ */
function buildSidebar() {
  const rc = {};
  S.countries.forEach(c => {
    rc[c.region || 'Other'] = (rc[c.region || 'Other'] || 0) + 1;
  });

  EL.regionList.innerHTML = '';
  const mkRBtn = (label, val, count) => {
    const b = document.createElement('button');
    b.className = 'rbtn' + (val === '' ? ' on' : '');
    b.innerHTML = `<span>${label}</span><span class="rbtn-count">${count}</span>`;
    b.addEventListener('click', () => {
      document.querySelectorAll('.rbtn').forEach(x => x.classList.remove('on'));
      b.classList.add('on');
      EL.regionFilter.value = val;
      filterAndRender();
    });
    return b;
  };
  EL.regionList.appendChild(mkRBtn('كل المناطق', '', S.countries.length));

  const regionNames = {
    Asia: 'آسيا', Europe: 'أوروبا', Africa: 'أفريقيا',
    Americas: 'الأمريكتان', Oceania: 'أوقيانوسيا',
    'North America': 'أمريكا الشمالية', 'South America': 'أمريكا الجنوبية'
  };
  Object.entries(rc).sort((a, b) => b[1] - a[1]).forEach(([r, n]) => {
    EL.regionList.appendChild(mkRBtn(regionNames[r] || r, r, n));
  });

  // Popular
  const pop = [...S.countries].sort((a, b) => b.recipes.length - a.recipes.length).slice(0, 6);
  EL.popularList.innerHTML = '';
  pop.forEach(c => {
    const imgUrl = getCountryBgImage(c.code, c.region, c.recipes);
    const d = document.createElement('div');
    d.className = 'pop-item';
    d.innerHTML = `
      <div class="pop-img-wrap">
        <img src="${imgUrl}" alt="${c.name_ar}" loading="lazy" class="pop-img" onerror="this.src='https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=100&q=70'"/>
      </div>
      <div class="pop-info">
        <div class="pop-name">${c.name_ar}</div>
        <div class="pop-cnt">${c.recipes.length} وصفة</div>
      </div>`;
    d.addEventListener('click', () => openModal(c.code));
    EL.popularList.appendChild(d);
  });
}

/* ══════════════════════════════════════════════
   Build Region Filter Options
   ══════════════════════════════════════════════ */
function buildRegionOptions() {
  const regions = [...new Set(S.countries.map(c => c.region).filter(Boolean))].sort();
  const regionNames = {
    Asia: 'آسيا', Europe: 'أوروبا', Africa: 'أفريقيا',
    Americas: 'الأمريكتان', Oceania: 'أوقيانوسيا',
    'North America': 'أمريكا الشمالية', 'South America': 'أمريكا الجنوبية'
  };
  regions.forEach(r => {
    const o = document.createElement('option');
    o.value = r; o.textContent = regionNames[r] || r;
    EL.regionFilter.appendChild(o);
  });
}

/* ══════════════════════════════════════════════
   Filter & Sort
   ══════════════════════════════════════════════ */
function filterAndRender() {
  const q      = EL.searchInput.value.trim().toLowerCase();
  const region = EL.regionFilter.value;
  const sort   = EL.sortSelect.value;

  EL.searchClear.classList.toggle('show', q.length > 0);

  S.filtered = S.countries.filter(c => {
    const txt = `${c.name_ar} ${c.name_en} ${c.code} ${c.region} ${c.capital}`.toLowerCase();
    const ok1 = !q || txt.includes(q) ||
      c.recipes.some(r => r.title_ar.toLowerCase().includes(q) || r.title_en.toLowerCase().includes(q));
    const ok2 = !region || c.region === region;
    return ok1 && ok2;
  });

  if (sort === 'recipes') {
    S.filtered.sort((a, b) => b.recipes.length - a.recipes.length);
  } else if (sort === 'region') {
    S.filtered.sort((a, b) => (a.region || '').localeCompare(b.region || ''));
  } else {
    S.filtered.sort((a, b) => a.name_ar.localeCompare(b.name_ar));
  }

  S.page = 0;
  renderGrid(false);
}

/* ══════════════════════════════════════════════
   Render Grid
   ══════════════════════════════════════════════ */
function renderGrid(append) {
  if (!append) EL.grid.innerHTML = '';

  const start = S.page * S.pageSize;
  const end   = start + S.pageSize;
  const slice = S.filtered.slice(start, end);

  if (!append && S.filtered.length === 0) {
    EL.grid.innerHTML = `<div class="no-results">
      <div class="no-results-ico">🔍</div>
      <h3>لا توجد نتائج</h3>
      <p>حاول البحث بكلمة مختلفة</p>
    </div>`;
    EL.lmWrap.style.display = 'none';
    EL.resultsText.innerHTML = 'لا توجد نتائج';
    return;
  }

  slice.forEach((c, i) => {
    const card = buildCard(c);
    card.style.animationDelay = `${(i % S.pageSize) * 0.03}s`;
    EL.grid.appendChild(card);
  });

  const shown = Math.min(end, S.filtered.length);
  EL.resultsText.innerHTML =
    `يعرض <strong>${shown.toLocaleString('ar-EG')}</strong> من <strong>${S.filtered.length.toLocaleString('ar-EG')}</strong> دولة`;
  EL.lmWrap.style.display = end < S.filtered.length ? 'flex' : 'none';
}

/* ══════════════════════════════════════════════
   Build Card — بطاقة الدولة مع صورة حقيقية
   ══════════════════════════════════════════════ */
function buildCard(c) {
  const n = EL.tpl.content.firstElementChild.cloneNode(true);
  const bgImg = getCountryBgImage(c.code, c.region, c.recipes);

  // صورة خلفية حقيقية للبطاقة عبر background-image
  const bgDiv = n.querySelector('.ccard-img');
  bgDiv.style.cssText += `
    background-image: url('${bgImg}');
    background-size: cover;
    background-position: center;
  `;

  // إخفاء العنصر القديم
  const oldFlag = n.querySelector('.ccard-flag-bg');
  if (oldFlag) oldFlag.style.display = 'none';

  n.querySelector('.ccard-flag-sm').textContent = c.flag;
  n.querySelector('.ccard-name').textContent = c.name_ar;
  n.querySelector('.ccard-name-en').textContent = c.name_en;

  const regionNames = {
    Asia: 'آسيا', Europe: 'أوروبا', Africa: 'أفريقيا',
    Americas: 'الأمريكتان', Oceania: 'أوقيانوسيا',
    'North America': 'أمريكا الشمالية', 'South America': 'أمريكا الجنوبية'
  };
  n.querySelector('.ccard-region').textContent =
    `${regionNames[c.region] || c.region}${c.subregion ? ' • ' + c.subregion : ''}`;
  n.querySelector('.ccard-summary').textContent = c.summary_ar || `مطبخ ${c.name_ar}`;

  const tags = n.querySelector('.ccard-tags');
  [`${c.capital || '—'}`, `${c.recipes.length} وصفة`].forEach((t, i) => {
    const s = document.createElement('span');
    s.className = 'tag' + (i === 1 ? ' hi' : '');
    s.textContent = t;
    tags.appendChild(s);
  });

  n.querySelector('.ccard-btn-cnt').textContent = c.recipes.length;

  const open = () => openModal(c.code);
  n.querySelector('.ccard-btn').addEventListener('click', open);
  n.querySelector('.ccard-open-btn').addEventListener('click', open);
  return n;
}

/* ══════════════════════════════════════════════
   Difficulty helper
   ══════════════════════════════════════════════ */
function diffClass(d) {
  if (!d) return 'easy';
  if (d.includes('سهل')) return 'easy';
  if (d.includes('متوسط')) return 'med';
  return 'hard';
}

function escXML(s) {
  return String(s || '').replace(/[<>&'"]/g, c =>
    ({ '<':'&lt;','>':'&gt;','&':'&amp;',"'":'&apos;','"':'&quot;' }[c]));
}

/* ══════════════════════════════════════════════
   Open Country Modal — مع صور حقيقية
   ══════════════════════════════════════════════ */
function openModal(code) {
  const c = S.countries.find(x => x.code === code);
  if (!c) return;

  const regionNames = {
    Asia: 'آسيا', Europe: 'أوروبا', Africa: 'أفريقيا',
    Americas: 'الأمريكتان', Oceania: 'أوقيانوسيا',
    'North America': 'أمريكا الشمالية', 'South America': 'أمريكا الجنوبية'
  };

  const recipesHTML = c.recipes.map((r, idx) => {
    // صورة حقيقية لكل وجبة
    const imgSrc = getFoodImage(r, c.code);
    const dc = diffClass(r.difficulty);
    return `
    <div class="rcard" style="animation-delay:${idx * 0.05}s">
      <div class="rcard-img">
        <img class="rcard-cover" src="${imgSrc}"
          alt="${escXML(r.title_ar)}" loading="lazy"
          onerror="this.src='https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80'"/>
        <div class="rcard-badges">
          <span class="diff-badge ${dc}">${r.difficulty || 'سهل'}</span>
          <span class="time-badge">${r.time_minutes} د</span>
        </div>
        <div class="rcard-overlay">
          <span class="rcard-title-overlay">${escXML(r.title_ar)}</span>
        </div>
      </div>
      <div class="rcard-body">
        <div class="rcard-title">${escXML(r.title_ar)}</div>
        <div class="rcard-title-en">${escXML(r.title_en)}</div>
        <div class="rcard-desc">${escXML(r.description_ar)}</div>
        <div class="rcard-stats">
          <span class="rstat"><i class="ri-time"></i> ${r.time_minutes} دقيقة</span>
          <span class="rstat"><i class="ri-group"></i> ${r.servings} حصص</span>
          <span class="rstat diff-inline ${dc}">${r.difficulty || 'سهل'}</span>
        </div>
        <div class="rcard-cols">
          <div class="rcol">
            <h5>المكوّنات</h5>
            <ul>${r.ingredients.map(i => `<li>${escXML(i)}</li>`).join('')}</ul>
          </div>
          <div class="rcol">
            <h5>طريقة التحضير</h5>
            <ol>${r.steps.map(s => `<li>${escXML(s)}</li>`).join('')}</ol>
          </div>
        </div>
        <div class="rcard-links">
          <a class="rlink yt" href="${r.links.youtube}" target="_blank" rel="noopener">فيديو يوتيوب</a>
          <a class="rlink gs" href="${r.links.google}" target="_blank" rel="noopener">بحث Google</a>
          <a class="rlink wp" href="${r.links.wikipedia}" target="_blank" rel="noopener">ويكيبيديا</a>
        </div>
      </div>
    </div>`;
  }).join('');

  // صورة خلفية للهيدر
  const heroBg = getCountryBgImage(c.code, c.region, c.recipes);

  EL.modalContent.innerHTML = `
    <div class="mhero" style="--hero-img: url('${heroBg}')">
      <div class="mhero-bg-photo"></div>
      <div class="mhero-overlay"></div>
      <div class="mhero-row">
        <div class="mhero-flag">${c.flag}</div>
        <div class="mhero-info">
          <div class="mhero-name">${c.name_ar}</div>
          <div class="mhero-sub">${c.name_en}</div>
          <div class="mhero-tags">
            <span class="mtag prim">${c.capital || '—'}</span>
            <span class="mtag">${regionNames[c.region] || c.region}</span>
            ${c.subregion ? `<span class="mtag">${c.subregion}</span>` : ''}
            <span class="mtag prim">${c.recipes.length} وصفة</span>
          </div>
        </div>
      </div>
      <div class="mhero-links">
        <a class="mlink prim" href="${c.search_links.google}" target="_blank" rel="noopener">أكلات ${c.name_ar}</a>
        <a class="mlink" href="${c.search_links.youtube}" target="_blank" rel="noopener">يوتيوب</a>
        <a class="mlink" href="${c.search_links.wikipedia}" target="_blank" rel="noopener">ويكيبيديا</a>
      </div>
    </div>
    <div class="mbody">
      <div class="msec-title">
        الوصفات التقليدية
        <span class="msec-cnt">${c.recipes.length} وصفة</span>
      </div>
      <div class="recipe-grid">${recipesHTML}</div>
    </div>`;

  EL.modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  EL.modal.classList.add('hidden');
  document.body.style.overflow = '';
}

/* ══════════════════════════════════════════════
   INIT
   ══════════════════════════════════════════════ */
async function init() {
  try {
    spawnParticles();
    loadTheme();

    const res = await fetch('./data/countries.json');
    if (!res.ok) throw new Error('fetch failed');
    S.countries = await res.json();
    S.filtered  = [...S.countries].sort((a, b) => a.name_ar.localeCompare(b.name_ar));

    buildRegionOptions();
    buildSidebar();

    // Update stats
    const total   = S.countries.length;
    const recipes = S.countries.reduce((n, c) => n + c.recipes.length, 0);
    animCount(EL.cCount, total);
    animCount(EL.rCount, recipes, 1800);
    // تحديث إحصائيات الـ hero و sidebar
    const heroC = document.getElementById('countriesCount');
    const heroR = document.getElementById('recipesCount');
    const sbC   = document.getElementById('countriesCount2');
    const sbR   = document.getElementById('recipesCount2');
    if (heroC) animCount(heroC, total);
    if (heroR) animCount(heroR, recipes, 1800);
    if (sbC) animCount(sbC, total);
    if (sbR) animCount(sbR, recipes, 1800);
    EL.navC.textContent = total.toLocaleString('ar-EG');
    EL.navR.textContent = recipes.toLocaleString('ar-EG');

    renderGrid(false);

    // Hide preloader
    setTimeout(() => EL.preloader.classList.add('out'), 1500);

    /* ── Events ── */
    let _st;
    EL.searchInput.addEventListener('input', () => {
      clearTimeout(_st);
      _st = setTimeout(filterAndRender, 200);
    });
    EL.searchClear.addEventListener('click', () => {
      EL.searchInput.value = '';
      EL.searchClear.classList.remove('show');
      filterAndRender();
    });
    EL.regionFilter.addEventListener('change', filterAndRender);
    EL.sortSelect.addEventListener('change', filterAndRender);

    EL.gridBtn.addEventListener('click', () => {
      S.view = 'grid';
      EL.grid.classList.remove('list-view');
      EL.gridBtn.classList.add('on');
      EL.listBtn.classList.remove('on');
    });
    EL.listBtn.addEventListener('click', () => {
      S.view = 'list';
      EL.grid.classList.add('list-view');
      EL.listBtn.classList.add('on');
      EL.gridBtn.classList.remove('on');
    });

    EL.lmBtn.addEventListener('click', () => {
      EL.lmBtn.classList.add('loading');
      setTimeout(() => {
        S.page++;
        renderGrid(true);
        EL.lmBtn.classList.remove('loading');
      }, 500);
    });

    const doRandom = () => {
      const pool = S.filtered.length ? S.filtered : S.countries;
      const item = pool[Math.floor(Math.random() * pool.length)];
      openModal(item.code);
      toast(`${item.name_ar} — اكتشاف عشوائي`);
    };
    EL.randomBtn.addEventListener('click', doRandom);

    EL.themeBtn.addEventListener('click', () => {
      const isLight = !document.body.classList.contains('light');
      setTheme(isLight);
      toast(isLight ? 'الوضع النهاري' : 'الوضع الليلي');
    });

    EL.modalClose.addEventListener('click', closeModal);
    EL.modalBd.addEventListener('click', closeModal);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeModal();
    });
    document.addEventListener('keydown', e => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        EL.searchInput.focus();
      }
    });

    window.addEventListener('scroll', () => {
      EL.navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });

  } catch (err) {
    console.error(err);
    EL.resultsText.textContent = 'تعذّر تحميل البيانات';
    EL.preloader.classList.add('out');
  }
}

init();
