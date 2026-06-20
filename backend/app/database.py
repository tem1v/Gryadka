from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from .config import settings
import uuid

DATABASE_URL = settings.DATABASE_URL

engine = create_engine(
    DATABASE_URL,
    pool_size=5,
    max_overflow=10,
    pool_pre_ping=True
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def seed_disease_recommendations(db: Session):
    from app.models import PlantDiseaseRecommendation
    count = db.query(PlantDiseaseRecommendation).count()
    if count > 0:
        return

    initial_data = [
        {
            "crop_name": "Картофель",
            "disease_name_ru": "Альтернариоз (Alternaria solani)",
            "disease_code": "potato_alternaria",
            "description": "Ранний сухой ожог. На нижних листьях появляются коричневые концентрические пятна, ткань засыхает и крошится.",
            "treatment": "1. Проведите обработку фунгицидами (Скор, Ридомил Голд).\n2. Соблюдайте севооборот.\n3. Вносите калийные удобрения для повышения иммунитета."
        },
        {
            "crop_name": "Картофель",
            "disease_name_ru": "Здоровый",
            "disease_code": "potato_healthy",
            "description": "Куст картофеля развивается нормально, признаки поражения патогенами отсутствуют.",
            "treatment": "Специального лечения не требуется. Продолжайте окучивание, умеренный полив и плановые подкормки."
        },
        {
            "crop_name": "Картофель",
            "disease_name_ru": "Фитофтороз",
            "disease_code": "potato_late_blight",
            "description": "Опасное грибковое заболевание. На листьях появляются быстро разрастающиеся бурые пятна, во влажную погоду — белый налет.",
            "treatment": "1. Немедленно удалите пораженную ботву.\n2. Опрыскайте медьсодержащими препаратами (Бордоская жидкость, Хом).\n3. Перед закладкой на хранение просушите клубни."
        },
        {
            "crop_name": "Перец",
            "disease_name_ru": "Бактериальная пятнистость (Xanthomonas)",
            "disease_code": "pepper_bacterial_spot",
            "description": "Бактериальное поражение. На листьях и плодах образуются мелкие водянистые пятна, которые со временем чернеют и вызывают листопад.",
            "treatment": "1. Удалите зараженные части растения.\n2. Обработайте медьсодержащими фунгицидами (Абига-Пик, Фитолавин).\n3. Исключите дождевание, поливайте строго под корень."
        },
        {
            "crop_name": "Перец",
            "disease_name_ru": "Здоровый",
            "disease_code": "pepper_healthy",
            "description": "Растение перца здорово, листья имеют ровный зеленый окрас, завязи развиваются правильно.",
            "treatment": "Лечение не требуется. Поддерживайте оптимальную температуру, избегайте переувлажнения почвы."
        },
        {
            "crop_name": "Помидор",
            "disease_name_ru": "Альтернариоз (Alternaria solani)",
            "disease_code": "tomato_alternaria",
            "description": "Сухая пятнистость томатов. Проявляется округлыми коричневыми пятнами с выраженными зональными кругами на листьях.",
            "treatment": "1. Ограничьте полив по листьям.\n2. Обработайте кусты фунгицидами (Квадрис, Скор).\n3. Удалите нижние старые листья для вентиляции."
        },
        {
            "crop_name": "Помидор",
            "disease_name_ru": "Бактериальная пятнистость (Xanthomonas)",
            "disease_code": "tomato_bacterial_spot",
            "description": "Бактериоз, вызывающий появление многочисленных мелких черных пятен. Листья желтеют и опадают, плоды теряют товарный вид.",
            "treatment": "1. Обработайте препаратами на основе меди или Фитолавином.\n2. Снизьте влажность воздуха.\n3. Удалите остатки растений из теплицы."
        },
        {
            "crop_name": "Помидор",
            "disease_name_ru": "Вирус желтой курчавости",
            "disease_code": "tomato_yellow_leaf_curl",
            "description": "Вирусное заболевание, переносимое белокрылкой. Листья резко мельчают, закручиваются вверх и желтеют, рост затормаживается.",
            "treatment": "1. Вирус неизлечим; полностью удалите и сожгите куст.\n2. Направьте все силы на борьбу с переносчиком — белокрылкой (Актара, Теппеки)."
        },
        {
            "crop_name": "Помидор",
            "disease_name_ru": "Здоровый",
            "disease_code": "tomato_healthy",
            "description": "Растение томата развивается отлично, тургор листьев в норме, следов болезней и вредителей нет.",
            "treatment": "Лечение не требуется. Проводите пасынкование, контролируйте влажность и подвязывайте кусты."
        },
        {
            "crop_name": "Помидор",
            "disease_name_ru": "Кладоспориоз (Cladosporium fulvum)",
            "disease_code": "tomato_cladosporium",
            "description": "Бурая пятнистость. На верхней стороне листьев появляются желтоватые пятна, а на нижней — бархатистый бурый налет.",
            "treatment": "1. Срочно уменьшите влажность в теплице (интенсивное проветривание).\n2. Обработайте биологическими препаратами (Фитоспорин, Псевдобактерин-2)."
        },
        {
            "crop_name": "Помидор",
            "disease_name_ru": "Мишеневидная пятнистость (Corynespora cassiicola)",
            "disease_code": "tomato_target_spot",
            "description": "На листьях образуются темно-коричневые пятна, напоминающие мишень. Приводит к преждевременному усыханию листвы.",
            "treatment": "1. Своевременно удаляйте пораженную листву.\n2. Примените системные фунгициды широкого спектра действия.\n3. Избегайте густой посадки."
        },
        {
            "crop_name": "Помидор",
            "disease_name_ru": "Мозаика вирусная",
            "disease_code": "tomato_mosaic_virus",
            "description": "Вирус, вызывающий пеструю (мозаичную) окраску листьев с чередованием темно- и светло-зеленых участков. Листья деформируются.",
            "treatment": "1. Лечения нет, пораженные растения подлежат немедленной утилизации.\n2. Продезинфицируйте садовый инвентарь раствором марганцовки."
        },
        {
            "crop_name": "Помидор",
            "disease_name_ru": "Паутинный клещ",
            "disease_code": "tomato_spider_mite",
            "description": "Вредитель. На листьях появляются мелкие белые точки, с обратной стороны видна тонкая паутинка. Листья поникают.",
            "treatment": "1. Обработайте специализированными инсектоакарицидами (Фитоверм, Вертимек, Клещевит).\n2. Повысьте влажность (клещ любит сухой воздух)."
        },
        {
            "crop_name": "Помидор",
            "disease_name_ru": "Септориоз (Septoria)",
            "disease_code": "tomato_septoria",
            "description": "Белая пятнистость листьев. Пятна мелкие, грязно-белые с темной каймой. Начинается с нижних листьев и идет вверх.",
            "treatment": "1. Удалите пораженные нижние листья.\n2. Опрыскайте кусты медьсодержащими препаратами или фунгицидом Танос.\n3. Проведите глубокую перекопку почвы осенью."
        },
        {
            "crop_name": "Помидор",
            "disease_name_ru": "Фитофтороз (Phytophthora infestans)",
            "disease_code": "tomato_late_blight",
            "description": "Наиболее опасный гриб. Бурые пятна на листьях и плодах, уничтожающие урожай за считанные дни при высокой влажности.",
            "treatment": "1. Обработайте системными фунгицидами (Ридомил Голд, Профит Голд, Консенто).\n2. Снимите бурые плоды на дозаривание.\n3. Не допускайте конденсата в теплице."
        }
    ]

    print("Инициализация базы знаний рекомендаций ИИ...")
    for item in initial_data:
        rec = PlantDiseaseRecommendation(
            id=str(uuid.uuid4()),
            crop_name=item["crop_name"],
            disease_name_ru=item["disease_name_ru"],
            disease_code=item["disease_code"],
            description=item["description"],
            treatment=item["treatment"]
        )
        db.add(rec)

    db.commit()
    print("База знаний успешно заполнена!")
