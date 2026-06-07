import os
from django.conf import settings
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.authtoken.models import Token
from api.models import Post, Order, Review
from django.db import transaction

User = get_user_model()

class Command(BaseCommand):
    help = "Seeds the database with test data matching images inside the timage folder."

    def handle(self, *args, **options):
        self.stdout.write("Clearing existing database...")
        Review.objects.all().delete()
        Order.objects.all().delete()
        Post.objects.all().delete()
        User.objects.all().delete()
        Token.objects.all().delete()

        # ==========================================
        # 1. CREATING USERS
        # ==========================================
        self.stdout.write("Creating users (1 Admin, 5 Farmers, 2 Customers)...")

        # Admin
        admin_user = User.objects.create_superuser(
            username="admin",
            email="admin@nobanno.gov.bd",
            password="adminpassword123",
            role="admin",
            name="Super Admin",
            phone_number="01000000000",
            address="Dhaka Secretariat",
            latitude=23.7291,
            longitude=90.4087,
            is_verified=True
        )
        Token.objects.create(user=admin_user)

        # 5 Farmers
        f1 = User.objects.create_user(
            username="fjamal", email="jamal@farms.com", password="f1",
            role="farmer", name="Jamal Uddin", phone_number="01712345678",
            address="Mymensingh Sadar, Mymensingh", latitude=24.7578, longitude=90.4003, is_verified=True
        )
        f2 = User.objects.create_user(
            username="frahim", email="rahim@bogura.com", password="f2",
            role="farmer", name="Rahim Mia", phone_number="01812345678",
            address="Sherpur, Bogura", latitude=24.8481, longitude=89.3730, is_verified=True
        )
        f3 = User.objects.create_user(
            username="fkarim", email="karim@rajshahi.com", password="f3",
            role="farmer", name="Karim Ahmed", phone_number="01612345678",
            address="Paba, Rajshahi", latitude=24.3745, longitude=88.6042, is_verified=True
        )
        f4 = User.objects.create_user(
            username="fselim", email="selim@jashore.com", password="f4",
            role="farmer", name="Selim Hossain", phone_number="01512345678",
            address="Benapole, Jashore", latitude=23.1664, longitude=89.2081, is_verified=True
        )
        f5 = User.objects.create_user(
            username="farif", email="arif@comilla.com", password="f5",
            role="farmer", name="Arif Chowdhury", phone_number="01998765432",
            address="Nangalkot, Comilla", latitude=23.4607, longitude=91.1809, is_verified=True
        )
        for f in [f1, f2, f3, f4, f5]:
            Token.objects.create(user=f)

        # 2 Customers
        c1 = User.objects.create_user(
            username="csadia", email="sadia@restaurant.com", password="c123",
            role="customer", name="Sadia's Kitchen", phone_number="01912345678",
            address="Road 11, Banani, Dhaka", latitude=23.7937, longitude=90.4066, balance=50000.00, is_verified=True
        )
        c2 = User.objects.create_user(
            username="chasan", email="hasan@retail.com", password="c23",
            role="customer", name="Hasan Groceries", phone_number="01512345678",
            address="Sector 4, Uttara, Dhaka", latitude=23.8759, longitude=90.3795, balance=35000.00, is_verified=True
        )
        for c in [c1, c2]:
            Token.objects.create(user=c)


        # ==========================================
        # 2. IMAGE UTILITY HANDLING
        # ==========================================
        self.stdout.write("Processing images from timage directory...")
        
        # Based on image_4a9487.png, timage is inside backend (settings.BASE_DIR)
        timage_dir = os.path.join(settings.BASE_DIR, 'timage')
        
        fallback_bytes = (
            b'\x47\x49\x46\x38\x39\x61\x01\x00\x01\x00\x80\x00\x00\x00\x00\x00'
            b'\xff\xff\xff\x21\xf9\x04\x01\x00\x00\x00\x00\x2c\x00\x00\x00\x00'
            b'\x01\x00\x01\x00\x00\x02\x02\x4c\x01\x00\x3b'
        )

        def get_image_file(filename):
            full_path = os.path.join(timage_dir, filename)
            
            # Case-insensitive resolution helper
            if os.path.exists(timage_dir):
                for actual_file in os.listdir(timage_dir):
                    if actual_file.lower() == filename.lower():
                        full_path = os.path.join(timage_dir, actual_file)
                        break

            if os.path.exists(full_path) and os.path.isfile(full_path):
                with open(full_path, 'rb') as f:
                    return SimpleUploadedFile(name=filename, content=f.read(), content_type='image/jpeg')
            else:
                self.stdout.write(self.style.WARNING(f"File {filename} not found at {full_path}, using fallback layout."))
                return SimpleUploadedFile(name=f"fallback_{filename}.gif", content=fallback_bytes, content_type='image/gif')# ==========================================
        # 3. DYNAMIC POSTS SEEDING (One per Image)
        # ==========================================
        self.stdout.write("Generating listings for each specific image file...")

        # Farmer 1 Listings (Bananas & Carrots)
        p_banana_avg = Post.objects.create(
            farmer=f1, title="Sagar Banana (Medium Size)", price_per_kg=40.00, total_weight_kg=500.00,
            description="Sweet, uniform medium size organic bananas directly cut from trees.",
            latitude=f1.latitude, longitude=f1.longitude, image=get_image_file("banana_avg.jpg")
        )
        Post.objects.create(
            farmer=f1, title="Premium Giant Bananas", price_per_kg=55.00, total_weight_kg=300.00,
            description="Large variety high yield banana, perfect for commercial wholesale distribution.",
            latitude=f1.latitude, longitude=f1.longitude, image=get_image_file("banana_large.jpg")
        )
        Post.objects.create(
            farmer=f1, title="Champa Banana (Short Variety)", price_per_kg=35.00, total_weight_kg=600.00,
            description="Traditional local short variety sweet Champa banana bunches.",
            latitude=f1.latitude, longitude=f1.longitude, image=get_image_file("banana_short.jpg")
        )
        Post.objects.create(
            farmer=f1, title="Fresh Spring Carrots (Grade A)", price_per_kg=60.00, total_weight_kg=400.00,
            description="Freshly uprooted organic crunchy sweet orange carrots.",
            latitude=f1.latitude, longitude=f1.longitude, image=get_image_file("carrot1.jpg")
        )
        Post.objects.create(
            farmer=f1, title="Juicing Carrots Bulk", price_per_kg=45.00, total_weight_kg=1200.00,
            description="Great value raw carrots sorted selectively for commercial scaling and juicing.",
            latitude=f1.latitude, longitude=f1.longitude, image=get_image_file("carrot2.jpg")
        )

        # Farmer 2 Listings (Cherries & Cucumbers)
        Post.objects.create(
            farmer=f2, title="Sweet Organic Red Cherries", price_per_kg=350.00, total_weight_kg=100.00,
            description="Freshly handpicked sweet bright red farm cherries.",
            latitude=f2.latitude, longitude=f2.longitude, image=get_image_file("cherries1.jpg")
        )
        Post.objects.create(
            farmer=f2, title="Dark Tart Cherries", price_per_kg=320.00, total_weight_kg=150.00,
            description="Rich deep colored tart baking cherries packed carefully in safety crates.",
            latitude=f2.latitude, longitude=f2.longitude, image=get_image_file("cherries2.jpg")
        )
        Post.objects.create(
            farmer=f2, title="Thai Green Cucumbers", price_per_kg=45.00, total_weight_kg=800.00,
            description="Crispy high water content long cucumbers, excellent for local markets.",
            latitude=f2.latitude, longitude=f2.longitude, image=get_image_file("cucucumber_thick.jpg")
        )
        Post.objects.create(
            farmer=f2, title="Local Deshi Shasha", price_per_kg=50.00, total_weight_kg=700.00,
            description="Perfect crispy native variety salad cucumbers fresh from the fields.",
            latitude=f2.latitude, longitude=f2.longitude, image=get_image_file("cucumber_dotted.jpg")
        )
        p_cucumber = Post.objects.create(
            farmer=f2, title="Green Salad Cucumber Bulk", price_per_kg=42.00, total_weight_kg=1000.00,
            description="Standard size greenhouse grown salad cucumbers available for wholesale purchase.",
            latitude=f2.latitude, longitude=f2.longitude, image=get_image_file("cucumber.jpg")
        )
        Post.objects.create(
            farmer=f2, title="Export Quality Long Cucumbers", price_per_kg=55.00, total_weight_kg=500.00,
            description="Premium straight glossy long green cucumbers selected for high shelf life.",
            latitude=f2.latitude, longitude=f2.longitude, image=get_image_file("cucumbers_extra_long.jpg")
        )

        # Farmer 3 Listings (Eggplant & Melons)
        Post.objects.create(
            farmer=f3, title="Long Purple Eggplant (Begun)", price_per_kg=65.00, total_weight_kg=450.00,
            description="Fresh long tender purple eggplants, perfect for making traditional dishes.",
            latitude=f3.latitude, longitude=f3.longitude, image=get_image_file("eggplant_long.jpg")
        )
        Post.objects.create(
            farmer=f3, title="Sweet Tormuj (Watermelons)", price_per_kg=35.00, total_weight_kg=2500.00,
            description="Juicy heavy red flesh sweet summer watermelons right out of Rajshahi.",
            latitude=f3.latitude, longitude=f3.longitude, image=get_image_file("melons1.jpg")
        )
        Post.objects.create(
            farmer=f3, title="Bangi (Muskmelons)", price_per_kg=30.00, total_weight_kg=1500.00,
            description="Aromatic ripe yellow muskmelons, great cooling nutritional summer food.",
            latitude=f3.latitude, longitude=f3.longitude, image=get_image_file("melons2.jpg")
        )

        # Farmer 4 Listings (Peaches & Potatoes)
        Post.objects.create(
            farmer=f4, title="Imported Juicy Peaches", price_per_kg=400.00, total_weight_kg=120.00,
            description="Highly sweet velvet skin fresh orchard peaches sorted carefully.",
            latitude=f4.latitude, longitude=f4.longitude, image=get_image_file("peaches.jpg")
        )
        Post.objects.create(
            farmer=f4, title="Bogura Diamond Potatoes", price_per_kg=38.00, total_weight_kg=5000.00,
            description="Bulk stock high quality starch rich white Diamond potatoes.",
            latitude=f4.latitude, longitude=f4.longitude, image=get_image_file("potato.jpg")
        )

        # Farmer 5 Listings (Rice, Tomato, Zucchini)
        Post.objects.create(
            farmer=f5, title="Premium Basmati Rice Long-Grain", price_per_kg=140.00, total_weight_kg=3000.00,
            description="Aged super long-grain aromatic Basmati rice processed cleanly for export.",
            latitude=f5.latitude, longitude=f5.longitude, image=get_image_file("rice_basmati.jpg")
        )
        Post.objects.create(
            farmer=f5, title="Miniket Rice Eco-Pack", price_per_kg=68.00, total_weight_kg=4000.00,
            description="Standard daily-use premium auto mill clean Miniket rice bags.",
            latitude=f5.latitude, longitude=f5.longitude, image=get_image_file("rice.jpg")
        )
        Post.objects.create(
            farmer=f5, title="Field Ripe Winter Tomatoes", price_per_kg=75.00, total_weight_kg=900.00,
            description="Firm juicy pulpy red tomatoes perfect for local grocery chains.",
            latitude=f5.latitude, longitude=f5.longitude, image=get_image_file("tomato.jpg")
        )
        Post.objects.create(
            farmer=f5, title="Fresh Green Zucchini", price_per_kg=90.00, total_weight_kg=350.00,
            description="Exotic tender glossy green zucchini squash harvested directly on order.",
            latitude=f5.latitude, longitude=f5.longitude, image=get_image_file("zuccini.jpg")
        )


        # ==========================================
        # 4. SIMULATION ORDERS & REVIEWS
        # ==========================================
        self.stdout.write("Simulating standard market checkouts...")

        # Order 1: Sadia buys 100kg Banana from Jamal
        with transaction.atomic():
            qty1 = 100.00
            total1 = round(qty1 * p_banana_avg.price_per_kg, 2)
            fee1 = round(total1 * 0.10, 2)
            payout1 = total1 - fee1

            c1.balance -= total1
            c1.save()
            p_banana_avg.total_weight_kg -= qty1
            p_banana_avg.save()

            Order.objects.create(
                customer=c1, post=p_banana_avg, quantity_kg=qty1, status="completed",
                total_paid=total1, platform_fee=fee1, farmer_payout=payout1,
                delivery_address="Road 11, Banani, Dhaka"
            )
            f1.balance += payout1
            f1.save()

        # Order 2: Hasan buys 50kg Cucumber from Rahim (Pending)
        with transaction.atomic():
            qty2 = 50.00
            total2 = round(qty2 * p_cucumber.price_per_kg, 2)
            fee2 = round(total2 * 0.10, 2)
            payout2 = total2 - fee2

            c2.balance -= total2
            c2.save()
            p_cucumber.total_weight_kg -= qty2
            p_cucumber.save()

            Order.objects.create(
                customer=c2, post=p_cucumber, quantity_kg=qty2, status="pending",
                total_paid=total2, platform_fee=fee2, farmer_payout=payout2,
                delivery_address="Sector 4, Uttara, Dhaka"
            )

        # Review
        Review.objects.create(
            customer=c1, farmer=f1, rating=5,
            comment="Excellent packaging on the banana stems! The delivery was pristine. Will continue sourcing from Jamal Uddin."
        )

        self.stdout.write(self.style.SUCCESS("Database seeded seamlessly with real image file links!"))
        self.stdout.write(f"  Admin: username=admin, password=adminpassword123")
        self.stdout.write(f"  Farmers (f1 to f5): username=fjamal, frahim, fkarim, fselim, farif | password=f1, f2, f3, f4, f5")
        self.stdout.write(f"  Customers (c1, c2): username=csadia (pw=c123), chasan (pw=c23)")