import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import "reflect-metadata";
import { DataSource } from "typeorm";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Entities (Simplified from NestJS) ---
// Note: In a real migration, we'd move these to separate files.
// For now, we'll define the core ones to get the app running.

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, ManyToOne, OneToMany } from "typeorm";

@Entity()
class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", unique: true })
  email!: string;

  @Column({ type: "varchar" })
  passwordHash!: string;

  @Column({ type: "varchar", default: "buyer" })
  role!: string; // 'admin', 'supplier', 'buyer'

  @Column({ type: "boolean", default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;
}

@Entity()
class BuyerProfile {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar" })
  userId!: string;

  @Column({ type: "varchar", nullable: true })
  fullName!: string;

  @Column({ type: "varchar", nullable: true })
  phone!: string;

  @Column({ type: "varchar", nullable: true })
  companyName!: string;

  @Column({ type: "varchar", nullable: true })
  title!: string;

  @Column({ type: "varchar", nullable: true })
  sector!: string;

  @Column({ type: "text", nullable: true })
  address!: string;

  @Column({ type: "varchar", nullable: true })
  website!: string;

  @Column({ type: "text", nullable: true })
  avatarBase64!: string;
}

@Entity()
class SupplierProfile {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar" })
  userId!: string;

  @Column({ type: "varchar", nullable: true })
  companyName!: string;

  @Column({ type: "varchar", nullable: true })
  phone!: string;

  @Column({ type: "varchar", nullable: true })
  taxNumber!: string;

  @Column({ type: "varchar", nullable: true })
  sector!: string;

  @Column({ type: "text", nullable: true })
  address!: string;

  @Column({ type: "varchar", nullable: true })
  website!: string;

  @Column({ type: "text", nullable: true })
  avatarBase64!: string;
}

@Entity()
class Category {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", unique: true })
  name!: string;

  @Column({ type: "varchar", nullable: true })
  description!: string;

  @Column({ type: "varchar", nullable: true })
  icon!: string;

  @CreateDateColumn()
  createdAt!: Date;
}

@Entity()
class GroupBuy {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar" })
  productName!: string;

  @Column({ type: "text", nullable: true })
  description!: string;

  @Column({ type: "varchar", nullable: true })
  category!: string;

  @Column({ type: "float" })
  targetQuantity!: number;

  @Column({ type: "float", default: 0 })
  currentQuantity!: number;

  @Column({ type: "float" })
  unitPrice!: number;

  @Column({ type: "varchar" })
  unit!: string; // 'kg', 'adet', 'ton' vb.

  @Column({ type: "datetime" })
  deadline!: Date;

  @Column({ type: "text", nullable: true })
  imagesBase64!: string; // JSON string of base64 array

  @Column({ type: "varchar", default: "active" })
  status!: string; // 'active', 'completed', 'cancelled'

  @Column({ type: "varchar" })
  supplierId!: string;

  @CreateDateColumn()
  createdAt!: Date;
}

@Entity()
class GroupBuyOrder {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar" })
  groupBuyId!: string;

  @Column({ type: "varchar" })
  buyerId!: string;

  @Column({ type: "float" })
  quantity!: number;

  @Column({ type: "varchar", default: "pending" })
  status!: string; // 'pending', 'paid', 'delivered'

  @CreateDateColumn()
  createdAt!: Date;
}

@Entity()
class GroupBuyOrderHistory {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar" })
  orderId!: string;

  @Column({ type: "float" })
  oldQuantity!: number;

  @Column({ type: "float" })
  newQuantity!: number;

  @Column({ type: "varchar" })
  action!: string; // 'create', 'update'

  @CreateDateColumn()
  createdAt!: Date;
}

// --- Database Setup ---
const isVercel = process.env.VERCEL === "1";
const dbPath = isVercel ? "/tmp/database.sqlite" : "database.sqlite";

const AppDataSource = new DataSource({
  type: "sqlite",
  database: dbPath,
  synchronize: true,
  logging: false,
  entities: [User, BuyerProfile, SupplierProfile, GroupBuy, GroupBuyOrder, GroupBuyOrderHistory, Category],
});

async function ensureDbInitialized() {
  if (!AppDataSource.isInitialized) {
    try {
      await AppDataSource.initialize();
      console.log("Data Source has been initialized!");
      
      // --- Admin Bootstrap ---
      const userRepo = AppDataSource.getRepository(User);
      const adminEmail = "admin";
      let admin = await userRepo.findOneBy({ email: adminEmail });
      const passwordHash = await bcrypt.hash("seyyah2846", 10);

      if (!admin) {
        console.log("Creating default admin user...");
        admin = userRepo.create({
          email: adminEmail,
          passwordHash,
          role: "admin",
          isActive: true
        });
        await userRepo.save(admin);
        console.log("Default admin user created.");
      } else {
        console.log("Admin user already exists. Updating password to ensure sync...");
        admin.passwordHash = passwordHash;
        admin.role = "admin";
        await userRepo.save(admin);
        console.log("Admin password updated.");
      }
    } catch (err) {
      console.error("Error during Data Source initialization", err);
      throw err;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// --- Health Check ---
app.get("/api/ping", (req, res) => {
  res.json({ message: "pong", timestamp: new Date().toISOString() });
});

// --- Request Logger ---
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// --- Middleware to ensure DB is initialized ---
app.use(async (req, res, next) => {
  try {
    await ensureDbInitialized();
    next();
  } catch (err) {
    console.error("Database initialization failed:", err);
    res.status(500).json({ message: "Veritabanı bağlantı hatası", error: String(err) });
  }
});

// --- Auth Routes ---
app.post("/auth/register", async (req, res) => {
  const { email, password, role, fullName, companyName, phone, taxNumber } = req.body;
  const userRepo = AppDataSource.getRepository(User);
  
  const existing = await userRepo.findOneBy({ email });
  if (existing) return res.status(400).json({ message: "Bu e-posta zaten kayıtlı" });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = userRepo.create({ email, passwordHash, role });
  await userRepo.save(user);

  if (role === "supplier") {
    const supplierRepo = AppDataSource.getRepository(SupplierProfile);
    const profile = supplierRepo.create({ userId: user.id, companyName, phone, taxNumber });
    await supplierRepo.save(profile);
  } else {
    const buyerRepo = AppDataSource.getRepository(BuyerProfile);
    const profile = buyerRepo.create({ userId: user.id, fullName, phone });
    await buyerRepo.save(profile);
  }

  const token = jwt.sign({ sub: user.id, email: user.email, role: user.role }, JWT_SECRET);
  res.json({ accessToken: token, role: user.role });
});

app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const userRepo = AppDataSource.getRepository(User);
  const user = await userRepo.findOneBy({ email });

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ message: "E-posta veya şifre hatalı" });
  }

  const token = jwt.sign({ sub: user.id, email: user.email, role: user.role }, JWT_SECRET);
  res.json({ accessToken: token, role: user.role });
});

const authenticate = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Yetkisiz erişim" });
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    res.status(401).json({ message: "Geçersiz token" });
  }
};

app.get("/auth/me", authenticate, async (req: any, res) => {
  await ensureDbInitialized();
  const userRepo = AppDataSource.getRepository(User);
  const user = await userRepo.findOne({
    where: { id: req.user.sub },
    select: ["id", "email", "role", "createdAt"]
  });
  res.json(user);
});

app.get("/profiles/me", authenticate, async (req: any, res) => {
  await ensureDbInitialized();
  if (req.user.role === "supplier") {
    const profile = await AppDataSource.getRepository(SupplierProfile).findOneBy({ userId: req.user.sub });
    res.json(profile);
  } else {
    const profile = await AppDataSource.getRepository(BuyerProfile).findOneBy({ userId: req.user.sub });
    res.json(profile);
  }
});

app.post("/profiles/me", authenticate, async (req: any, res) => {
  await ensureDbInitialized();
  const data = req.body;
  if (req.user.role === "supplier") {
    const repo = AppDataSource.getRepository(SupplierProfile);
    let profile: any = await repo.findOneBy({ userId: req.user.sub });
    if (profile) {
      Object.assign(profile, data);
    } else {
      profile = repo.create(data as any);
      profile.userId = req.user.sub;
    }
    await repo.save(profile);
    res.json(profile);
  } else {
    const repo = AppDataSource.getRepository(BuyerProfile);
    let profile: any = await repo.findOneBy({ userId: req.user.sub });
    if (profile) {
      Object.assign(profile, data);
    } else {
      profile = repo.create(data as any);
      profile.userId = req.user.sub;
    }
    await repo.save(profile);
    res.json(profile);
  }
});

// --- Group Buy Routes ---
app.get("/api/group-buys", async (req, res) => {
  await ensureDbInitialized();
  const repo = AppDataSource.getRepository(GroupBuy);
  const groupBuys = await repo.find({
    where: { status: "active" },
    order: { createdAt: "DESC" }
  });
  res.json(groupBuys);
});

app.post("/api/group-buys", authenticate, async (req: any, res) => {
  await ensureDbInitialized();
  if (req.user.role !== "supplier") {
    return res.status(403).json({ message: "Sadece tedarikçiler grup alımı başlatabilir" });
  }
  const repo = AppDataSource.getRepository(GroupBuy);
  const groupBuy = repo.create({
    ...req.body,
    imagesBase64: req.body.imagesBase64 ? JSON.stringify(req.body.imagesBase64) : null,
    supplierId: req.user.sub,
    currentQuantity: 0,
    status: "active"
  });
  await repo.save(groupBuy);
  res.json(groupBuy);
});

app.patch("/api/group-buys/:id", authenticate, async (req: any, res) => {
  await ensureDbInitialized();
  const repo = AppDataSource.getRepository(GroupBuy);
  const gb = await repo.findOneBy({ id: req.params.id });
  if (!gb) return res.status(404).json({ message: "İlan bulunamadı" });
  
  // Check if owner or admin
  if (gb.supplierId !== req.user.sub && req.user.role !== 'admin') {
    return res.status(403).json({ message: "Bu işlemi yapmaya yetkiniz yok" });
  }

  if (req.body.imagesBase64) {
    req.body.imagesBase64 = JSON.stringify(req.body.imagesBase64);
  }
  
  Object.assign(gb, req.body);
  await repo.save(gb);
  res.json(gb);
});

app.post("/api/group-buys/:id/join", authenticate, async (req: any, res) => {
  await ensureDbInitialized();
  if (req.user.role !== "buyer") {
    return res.status(403).json({ message: "Sadece alıcılar grup alımına katılabilir" });
  }
  const { quantity } = req.body; // Bu artık yeni toplam miktar olacak
  const groupBuyRepo = AppDataSource.getRepository(GroupBuy);
  const orderRepo = AppDataSource.getRepository(GroupBuyOrder);
  const historyRepo = AppDataSource.getRepository(GroupBuyOrderHistory);

  const groupBuy = await groupBuyRepo.findOneBy({ id: req.params.id });
  if (!groupBuy || groupBuy.status !== "active") {
    return res.status(404).json({ message: "Grup alımı bulunamadı veya aktif değil" });
  }

  // Mevcut siparişi kontrol et
  let order = await orderRepo.findOneBy({ 
    groupBuyId: groupBuy.id, 
    buyerId: req.user.sub 
  });

  let oldQuantity = 0;
  let action = 'create';

  if (order) {
    oldQuantity = order.quantity;
    action = 'update';
    order.quantity = quantity;
  } else {
    order = orderRepo.create({
      groupBuyId: groupBuy.id,
      buyerId: req.user.sub,
      quantity,
      status: "pending"
    });
  }
  
  await orderRepo.save(order);

  // Geçmiş kaydı oluştur
  const history = historyRepo.create({
    orderId: order.id,
    oldQuantity,
    newQuantity: quantity,
    action
  });
  await historyRepo.save(history);

  // İlanın toplam miktarını güncelle
  // (Yeni Toplam = Eski Toplam - Eski Sipariş Miktarı + Yeni Sipariş Miktarı)
  groupBuy.currentQuantity = groupBuy.currentQuantity - oldQuantity + quantity;
  await groupBuyRepo.save(groupBuy);

  res.json(order);
});

app.get("/api/orders/:id/history", authenticate, async (req: any, res) => {
  await ensureDbInitialized();
  const historyRepo = AppDataSource.getRepository(GroupBuyOrderHistory);
  const history = await historyRepo.find({
    where: { orderId: req.params.id },
    order: { createdAt: "DESC" }
  });
  res.json(history);
});

app.get("/api/my-orders", authenticate, async (req: any, res) => {
  await ensureDbInitialized();
  const orderRepo = AppDataSource.getRepository(GroupBuyOrder);
  const orders = await orderRepo.find({
    where: { buyerId: req.user.sub },
    order: { createdAt: "DESC" }
  });
  
  // Siparişlerle birlikte grup alımı detaylarını da getir (Basit join simülasyonu)
  const groupBuyRepo = AppDataSource.getRepository(GroupBuy);
  const enrichedOrders = await Promise.all(orders.map(async (order) => {
    const groupBuy = await groupBuyRepo.findOneBy({ id: order.groupBuyId });
    return { ...order, groupBuy };
  }));

  res.json(enrichedOrders);
});

// --- Admin Routes ---
const isAdmin = (req: any, res: any, next: any) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Yetkisiz erişim" });
  next();
};

app.get("/api/admin/stats", authenticate, isAdmin, async (req, res) => {
  await ensureDbInitialized();
  const userRepo = AppDataSource.getRepository(User);
  const gbRepo = AppDataSource.getRepository(GroupBuy);
  const orderRepo = AppDataSource.getRepository(GroupBuyOrder);

  const totalUsers = await userRepo.count();
  const totalGroupBuys = await gbRepo.count();
  const totalOrders = await orderRepo.count();
  const activeGroupBuys = await gbRepo.countBy({ status: "active" });

  res.json({ totalUsers, totalGroupBuys, totalOrders, activeGroupBuys });
});

app.get("/api/admin/users", authenticate, isAdmin, async (req, res) => {
  await ensureDbInitialized();
  const userRepo = AppDataSource.getRepository(User);
  const users = await userRepo.find({ order: { createdAt: "DESC" } });
  res.json(users);
});

app.delete("/api/admin/users/:id", authenticate, isAdmin, async (req, res) => {
  await ensureDbInitialized();
  const userRepo = AppDataSource.getRepository(User);
  await userRepo.delete(req.params.id);
  res.json({ message: "Kullanıcı silindi" });
});

app.get("/api/admin/users/:id/profile", authenticate, isAdmin, async (req, res) => {
  await ensureDbInitialized();
  const user = await AppDataSource.getRepository(User).findOneBy({ id: req.params.id });
  if (!user) return res.status(404).json({ message: "Kullanıcı bulunamadı" });

  let profile;
  if (user.role === "supplier") {
    profile = await AppDataSource.getRepository(SupplierProfile).findOneBy({ userId: user.id });
  } else {
    profile = await AppDataSource.getRepository(BuyerProfile).findOneBy({ userId: user.id });
  }
  res.json({ user, profile });
});

app.patch("/api/admin/users/:id/profile", authenticate, isAdmin, async (req, res) => {
  await ensureDbInitialized();
  const { role, isActive, profileData } = req.body;
  const userRepo = AppDataSource.getRepository(User);
  const user = await userRepo.findOneBy({ id: req.params.id });
  
  if (!user) return res.status(404).json({ message: "Kullanıcı bulunamadı" });

  if (role) user.role = role;
  if (isActive !== undefined) user.isActive = isActive;
  await userRepo.save(user);

  if (profileData) {
    if (user.role === "supplier") {
      const repo = AppDataSource.getRepository(SupplierProfile);
      let profile = await repo.findOneBy({ userId: user.id });
      if (profile) {
        Object.assign(profile, profileData);
        await repo.save(profile);
      } else {
        const newProfile = repo.create({ ...profileData, userId: user.id } as any);
        await repo.save(newProfile);
      }
    } else {
      const repo = AppDataSource.getRepository(BuyerProfile);
      let profile = await repo.findOneBy({ userId: user.id });
      if (profile) {
        Object.assign(profile, profileData);
        await repo.save(profile);
      } else {
        const newProfile = repo.create({ ...profileData, userId: user.id } as any);
        await repo.save(newProfile);
      }
    }
  }
  res.json({ message: "Profil güncellendi" });
});

app.post("/api/admin/users/:id/message", authenticate, isAdmin, async (req, res) => {
  const { subject, message } = req.body;
  console.log(`Admin message to user ${req.params.id}: [${subject}] ${message}`);
  // Gerçek bir sistemde burada e-posta servisi veya bildirim tablosu kullanılır.
  res.json({ message: "Mesaj başarıyla gönderildi (Simüle edildi)" });
});

app.get("/api/admin/group-buys", authenticate, isAdmin, async (req, res) => {
  await ensureDbInitialized();
  const gbRepo = AppDataSource.getRepository(GroupBuy);
  const gbs = await gbRepo.find({ order: { createdAt: "DESC" } });
  res.json(gbs);
});

app.patch("/api/admin/group-buys/:id", authenticate, isAdmin, async (req, res) => {
  await ensureDbInitialized();
  const repo = AppDataSource.getRepository(GroupBuy);
  const gb = await repo.findOneBy({ id: req.params.id });
  if (!gb) return res.status(404).json({ message: "İlan bulunamadı" });
  
  if (req.body.imagesBase64) {
    req.body.imagesBase64 = JSON.stringify(req.body.imagesBase64);
  }
  
  Object.assign(gb, req.body);
  await repo.save(gb);
  res.json(gb);
});

app.delete("/api/admin/group-buys/:id", authenticate, isAdmin, async (req, res) => {
  await ensureDbInitialized();
  const gbRepo = AppDataSource.getRepository(GroupBuy);
  await gbRepo.delete(req.params.id);
  res.json({ message: "İlan silindi" });
});

app.patch("/api/admin/group-buys/:id/status", authenticate, isAdmin, async (req, res) => {
  await ensureDbInitialized();
  const gbRepo = AppDataSource.getRepository(GroupBuy);
  const gb = await gbRepo.findOneBy({ id: req.params.id });
  if (gb) {
    gb.status = req.body.status;
    await gbRepo.save(gb);
  }
  res.json(gb);
});

// --- Category Helpers ---
async function syncCategories() {
  await ensureDbInitialized();
  const categoryRepo = AppDataSource.getRepository(Category);
  const gbRepo = AppDataSource.getRepository(GroupBuy);
  
  // Get all unique categories from GroupBuy
  const usedCategories = await gbRepo
    .createQueryBuilder("gb")
    .select("DISTINCT gb.category", "category")
    .getRawMany();
  
  // Auto-create missing categories
  for (const row of usedCategories) {
    if (row.category) {
      const existing = await categoryRepo.findOneBy({ name: row.category });
      if (!existing) {
        const newCat = categoryRepo.create({
          name: row.category,
          description: "Sistem tarafından otomatik oluşturuldu (İlanlarda kullanılıyor)",
          icon: "Package"
        });
        await categoryRepo.save(newCat);
      }
    }
  }
}

// --- Category Routes ---
app.get("/api/categories", async (req, res) => {
  await syncCategories();
  const categoryRepo = AppDataSource.getRepository(Category);
  const categories = await categoryRepo.find({ order: { name: "ASC" } });
  res.json(categories);
});

app.get("/api/admin/categories", authenticate, isAdmin, async (req, res) => {
  await syncCategories();
  const categoryRepo = AppDataSource.getRepository(Category);
  const categories = await categoryRepo.find({ order: { createdAt: "DESC" } });
  res.json(categories);
});

app.post("/api/admin/categories/bulk", authenticate, isAdmin, async (req, res) => {
  await ensureDbInitialized();
  const { categories } = req.body; // Array of { name, description, icon }
  if (!Array.isArray(categories)) return res.status(400).json({ message: "Geçersiz veri formatı" });

  const categoryRepo = AppDataSource.getRepository(Category);
  const results = [];
  
  for (const cat of categories) {
    if (!cat.name) continue;
    let existing = await categoryRepo.findOneBy({ name: cat.name });
    if (existing) {
      existing.description = cat.description || existing.description;
      existing.icon = cat.icon || existing.icon;
      await categoryRepo.save(existing);
      results.push(existing);
    } else {
      const newCat = categoryRepo.create(cat);
      await categoryRepo.save(newCat);
      results.push(newCat);
    }
  }
  res.json({ message: `${results.length} kategori başarıyla işlendi.`, categories: results });
});

app.patch("/api/admin/categories/:id", authenticate, isAdmin, async (req, res) => {
  await ensureDbInitialized();
  const { name, description, icon } = req.body;
  const categoryRepo = AppDataSource.getRepository(Category);
  const category = await categoryRepo.findOneBy({ id: req.params.id });
  
  if (!category) return res.status(404).json({ message: "Kategori bulunamadı" });

  if (name) category.name = name;
  if (description !== undefined) category.description = description;
  if (icon !== undefined) category.icon = icon;

  try {
    await categoryRepo.save(category);
    res.json(category);
  } catch (err) {
    res.status(400).json({ message: "Kategori güncellenemedi (İsim çakışması olabilir)" });
  }
});

app.delete("/api/admin/categories/:id", authenticate, isAdmin, async (req, res) => {
  await ensureDbInitialized();
  const categoryRepo = AppDataSource.getRepository(Category);
  await categoryRepo.delete(req.params.id);
  res.json({ message: "Kategori silindi" });
});

// --- Admin Routes ---
// ... (existing routes)

// --- Global Error Handler ---
app.use((err: any, req: any, res: any, next: any) => {
  console.error("Global Error Handler:", err);
  res.status(500).json({ 
    message: "Sunucu hatası oluştu", 
    error: err.message || String(err),
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack
  });
});

// --- Vite Middleware ---
if (process.env.NODE_ENV !== "production") {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
} else {
  const distPath = path.join(__dirname, "../dist");
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

// --- Server Başlatma (her ortamda çalışır) ---
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await ensureDbInitialized();
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Error during server startup", err);
    process.exit(1);
  }
}

startServer();

export default app;
