$images = @{
    "santa-maria-goretti.jpg" = "St._Maria_Goretti_(1371804837).jpg"
    "sao-tarcisio.jpg" = "The_Martyrdom_of_Saint_Tarcisius_f._Antony_Troncet.jpg"
    "sao-francisco-marto.jpg" = "Francisco_Marto2.jpg"
    "irma-clare-crockett.jpg" = "Sister_Clare_Crockett%27s_(cropped).jpg"
    "sao-domingos-savio.jpg" = "S%C3%A3o_Domingos_S%C3%A1vio.jpg"
    "sao-carlo-acutis.jpg" = "Carlo_Acutis_at_SMCB.jpg"
    "santa-teresinha.jpg" = "Santa_Teresinha_do_Menino_Jesus_(Exterior).jpg"
    "santa-jacinta-marto.jpg" = "Jacinta-marto-fatima-portugal-1917.jpg"
    "sao-pier-giorgio-frassati.jpg" = "PierGiorgioFrassati-Pr%C3%A9sentation.jpg"
    "beata-sandra-sabattini.jpg" = "Sandra_Sabattini.jpg"
    "beata-laura-vicuna.jpg" = "Laura_Vicu%C3%B1a.jpg"
    "sao-luis-gonzaga.jpg" = "San_Luis_Gonzaga_(Goya).jpg"
}

$userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"

if (-not (Test-Path public/images)) {
    New-Item -ItemType Directory -Path public/images
}

foreach ($key in $images.Keys) {
    try {
        $url = "https://commons.wikimedia.org/wiki/Special:FilePath/" + $images[$key]
        Write-Host "Downloading $key from $url"
        Invoke-WebRequest -UserAgent $userAgent -Uri $url -OutFile "public/images/$key"
    } catch {
        Write-Host "Failed to download $key : $_"
        # Placeholder
        Invoke-WebRequest -Uri "https://placehold.co/400x600/png?text=$key" -OutFile "public/images/$key"
    }
}

# Special handling for missing ones
Write-Host "Downloading placeholders for missing images..."
Invoke-WebRequest -Uri "https://placehold.co/400x600/png?text=Chiara+Badano" -OutFile "public/images/beata-chiara-luce-badano.jpg"
Invoke-WebRequest -Uri "https://placehold.co/400x600/png?text=Chiara+Corbella" -OutFile "public/images/serva-de-deus-chiara-corbella-petrillo.jpg"
